<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Services\QuoteService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuoteController extends Controller
{
    public function __construct(
        private QuoteService $quoteService
    ) {}

    /**
     * Display a listing of quotes.
     */
    public function index(Request $request): InertiaResponse
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'user_id' => $request->input('user_id'),
            'company_id' => $request->input('company_id'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $quotes = $this->quoteService->getPaginated(
            $filters,
            $sort,
            $request->input('per_page', 20)
        );

        return Inertia::render('Admin/Quotes/Index', [
            'quotes' => $quotes,
            'filters' => $filters,
            'sort' => $sort,
            'stats' => $this->quoteService->getStats(),
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Show the form for creating a new quote.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Admin/Quotes/Create', [
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Store a newly created quote.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'company_id' => 'nullable|exists:companies,id',
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_phone' => 'nullable|string|max:20',
            'client_company' => 'nullable|string|max:255',
            'client_address' => 'nullable|string',
            'requirements' => 'nullable|string',
            'custom_specifications' => 'nullable|array',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:1',
            'expires_at' => 'nullable|date',
            'status' => 'required|in:draft,sent,reviewed,approved,rejected,expired',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'nullable|exists:services,id',
            'items.*.service_plan_id' => 'nullable|exists:service_plans,id',
            'items.*.service_item_id' => 'nullable|exists:service_items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.item_type' => 'required|string',
            'items.*.billing_type' => 'required|in:one_time,monthly,quarterly,yearly',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.estimated_days' => 'nullable|integer|min:0',
            'items.*.sort_order' => 'nullable|integer',
        ]);

        try {
            $quote = $this->quoteService->createQuote($validated);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを作成しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの作成に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified quote.
     */
    public function show(Quote $quote): InertiaResponse
    {
        $quote->load([
            'user',
            'company',
            'items.service',
            'items.servicePlan',
            'items.serviceItem',
            'creator',
            'updater',
        ]);

        return Inertia::render('Admin/Quotes/Show', [
            'quote' => $quote,
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Show the form for editing the specified quote.
     */
    public function edit(Quote $quote)
    {
        // 承認済みの見積もりは編集できない
        if ($quote->status === 'approved') {
            return redirect()->route('admin.quote.show', $quote)
                ->with('error', '承認済みの見積もりは編集できません。');
        }

        $quote->load(['items']);

        return Inertia::render('Admin/Quotes/Edit', [
            'quote' => $quote,
            'statuses' => $this->quoteService->getStatuses(),
        ]);
    }

    /**
     * Update the specified quote.
     */
    public function update(Request $request, Quote $quote)
    {
        // 承認済みの見積もりは編集できない
        if ($quote->status === 'approved') {
            return back()->with('error', '承認済みの見積もりは編集できません。');
        }

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'company_id' => 'nullable|exists:companies,id',
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_phone' => 'nullable|string|max:20',
            'client_company' => 'nullable|string|max:255',
            'client_address' => 'nullable|string',
            'requirements' => 'nullable|string',
            'custom_specifications' => 'nullable|array',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:1',
            'expires_at' => 'nullable|date',
            'status' => 'required|in:draft,sent,reviewed,approved,rejected,expired',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'nullable|exists:services,id',
            'items.*.service_plan_id' => 'nullable|exists:service_plans,id',
            'items.*.service_item_id' => 'nullable|exists:service_items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.item_type' => 'required|string',
            'items.*.billing_type' => 'required|in:one_time,monthly,quarterly,yearly',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.estimated_days' => 'nullable|integer|min:0',
            'items.*.sort_order' => 'nullable|integer',
        ]);

        try {
            $this->quoteService->updateQuote($quote, $validated);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを更新しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの更新に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified quote.
     */
    public function destroy(Quote $quote)
    {
        try {
            $this->quoteService->deleteQuote($quote);

            return redirect()->route('admin.quote.index')
                ->with('success', '見積もりを削除しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの削除に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Send the quote to client.
     */
    public function send(Quote $quote)
    {
        try {
            $this->quoteService->sendQuote($quote);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを送信しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの送信に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Approve the quote.
     */
    public function approve(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'client_feedback' => 'nullable|string',
        ]);

        try {
            $this->quoteService->approveQuote($quote, $validated['client_feedback'] ?? null);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを承認しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの承認に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Reject the quote.
     */
    public function reject(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'client_feedback' => 'nullable|string',
        ]);

        try {
            $this->quoteService->rejectQuote($quote, $validated['client_feedback'] ?? null);

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', '見積もりを却下しました。');
        } catch (\Exception $e) {
            return back()->with('error', '見積もりの却下に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Download quote as PDF.
     */
    public function downloadPdf(Quote $quote)
    {
        try {
            $quote->load([
                'user',
                'company',
                'items' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'creator',
            ]);

            // PDFを生成
            $pdf = Pdf::loadView('pdfs.quote', [
                'quote' => $quote,
            ]);

            // A4サイズ、縦向き
            $pdf->setPaper('A4', 'portrait');

            // ファイル名を生成
            $filename = sprintf('見積書_%s_%s.pdf', $quote->quote_number, date('Ymd'));

            // PDFをダウンロード
            return $pdf->download($filename);
        } catch (\Exception $e) {
            return back()->with('error', 'PDFの生成に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Preview quote as PDF in browser.
     */
    public function previewPdf(Quote $quote)
    {
        try {
            $quote->load([
                'user',
                'company',
                'items' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'creator',
            ]);

            // PDFを生成
            $pdf = Pdf::loadView('pdfs.quote', [
                'quote' => $quote,
            ]);

            // A4サイズ、縦向き
            $pdf->setPaper('A4', 'portrait');

            // ブラウザでプレビュー表示
            return $pdf->stream(sprintf('見積書_%s.pdf', $quote->quote_number));
        } catch (\Exception $e) {
            return back()->with('error', 'PDFの生成に失敗しました: ' . $e->getMessage());
        }
    }
}
