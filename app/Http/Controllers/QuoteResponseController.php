<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\QuoteResponse;
use App\Models\Admin;
use App\Notifications\QuoteResponseReceived;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Notification;

class QuoteResponseController extends Controller
{
    /**
     * Show the quote response form (Public - No Auth).
     */
    public function show(string $token): Response
    {
        $quoteResponse = QuoteResponse::where('token', $token)
            ->firstOrFail();

        $quote = $quoteResponse->quote;

        return Inertia::render('QuoteResponseForm', [
            'quote' => [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'title' => $quote->title,
                'total_amount' => $quote->total_amount,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Store the quote response (Public - No Auth).
     */
    public function store(Request $request, string $token)
    {
        $quoteResponse = QuoteResponse::where('token', $token)
            ->firstOrFail();

        // Validation
        $validated = $request->validate([
            'response_type' => 'required|in:request,decline,revision_request,other',
            'response_text' => 'nullable|string|max:1000',
        ]);

        // Add text validation for "other" type
        if ($validated['response_type'] === 'other' && !$validated['response_text']) {
            return back()->withErrors(['response_text' => '詳細をお入力ください']);
        }

        // Update response
        $quoteResponse->update([
            'response_type' => $validated['response_type'],
            'response_text' => $validated['response_text'],
            'responded_at' => now(),
            'admin_notified_at' => now(),
        ]);

        // Send notification to all admins
        $admins = \App\Models\Admin::all();
        Notification::send($admins, new QuoteResponseReceived($quoteResponse));

        return redirect()->back();
    }

    /**
     * Display a listing of quote responses (Admin).
     */
    public function index(Request $request): Response
    {
        $query = QuoteResponse::with('quote');

        // Filter by status
        if ($request->has('status') && $request->status === 'pending') {
            $query->whereNull('responded_at');
        } elseif ($request->has('status') && $request->status === 'responded') {
            $query->whereNotNull('responded_at');
        }

        $responses = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/QuoteResponses/Index', [
            'responses' => $responses,
            'filters' => [
                'status' => $request->query('status'),
            ],
        ]);
    }

    /**
     * Display the specified quote response (Admin).
     */
    public function detail(string $id): Response
    {
        $response = QuoteResponse::with('quote')->findOrFail($id);

        return Inertia::render('Admin/QuoteResponses/Detail', [
            'response' => $response,
        ]);
    }
}
