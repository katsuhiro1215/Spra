<?php

namespace App\Http\Controllers;

use App\Models\QuoteResponse;
use App\Notifications\QuoteResponseReceived;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\RedirectResponse;

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

        // ログに記録
        \App\Models\UserActivityLog::logActivity([
            'action' => \App\Models\UserActivityLog::ACTION_QUOTE_RESPONSE_RECEIVED,
            'description' => "見積番号 {$quoteResponse->quote->quote_number} にお客様から返信がありました（{$quoteResponse->getResponseTypeLabel()}）",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => \App\Models\UserActivityLog::STATUS_SUCCESS,
        ]);

        return redirect()->back();
    }

    /**
     * Show the registration form (Public - Invitation Token).
     */
    public function registerShow(string $token): Response|RedirectResponse
    {
        $quoteResponse = QuoteResponse::where('token', $token)
            ->firstOrFail();

        // Check if already registered
        if ($quoteResponse->user_id) {
            return redirect()->route('home')->with('error', 'このリンクは既に使用されています。');
        }

        // Check if token is expired (7 days)
        if ($quoteResponse->created_at->addDays(7)->isPast()) {
            return redirect()->route('home')->with('error', 'このリンクの有効期限が切れています。');
        }

        return Inertia::render('QuoteResponseRegister', [
            'token' => $token,
            'email' => $quoteResponse->email,
        ]);
    }

    /**
     * Store the registration (Public - Invitation Token).
     * Stage 1: Minimal registration (User + Company only)
     */
    public function registerStore(Request $request, string $token): Response|RedirectResponse
    {
        try {
            $quoteResponse = QuoteResponse::where('token', $token)
                ->firstOrFail();

            // Check if already registered
            if ($quoteResponse->user_id) {
                return redirect()->route('home')->with('error', 'このリンクは既に使用されています。');
            }

            // Check if token is expired (7 days)
            if ($quoteResponse->created_at->addDays(7)->isPast()) {
                return redirect()->route('home')->with('error', 'このリンクの有効期限が切れています。');
            }

            // Validate - Stage 1: Only essential information
            $validated = $request->validate([
                'password' => 'required|string|min:8|confirmed',
                'company_name' => 'required|string|max:255',
                'company_type' => 'required|in:individual,corporate',
                'agreed' => 'accepted',
            ], [
                'agreed.accepted' => 'プライバシーポリシーおよび利用規約への同意が必要です。',
            ]);

            \Illuminate\Support\Facades\DB::transaction(function () use ($quoteResponse, $validated) {

                // Create User
                $user = \App\Models\User::create([
                    'email' => $quoteResponse->email,
                    'password' => bcrypt($validated['password']),
                    'status' => 'pending', // Pending admin approval
                ]);

                // Create Company
                $company = \App\Models\Company::create([
                    'name' => $validated['company_name'],
                    'company_type' => $validated['company_type'],
                    'status' => 'pending', // Pending admin approval (see OnboardingController::approve)
                ]);

                // Attach user to company
                $user->companies()->attach($company->id, [
                    'role' => 'owner',
                    'is_primary' => true,
                    'joined_at' => now(),
                ]);

                // Update QuoteResponse
                $quoteResponse->update([
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'admin_notified_at' => now(),
                ]);

                // 元の見積（シミュレーター経由でゲストとして作成された時点では
                // user_id/company_id が無い）に、今作成したUser/Companyを紐付ける。
                // これをしないと、登録後もUser側のダッシュボード（user_idで絞り込み）に
                // この見積が一切表示されなくなる。
                if ($quoteResponse->quote_id) {
                    \App\Models\Quote::where('id', $quoteResponse->quote_id)->update([
                        'user_id' => $user->id,
                        'company_id' => $company->id,
                    ]);
                }
            });

            return redirect()->route('user.login')->with('success', 'アカウントを作成しました。ログインしてダッシュボードにアクセスしてください。管理者の確認後、追加情報の登録をお願いいたします。');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'アカウント作成に失敗しました。もう一度お試しください。']);
        }
    }
}
