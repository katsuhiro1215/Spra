<?php

namespace App\Http\Controllers\Admin\Quote;

use App\Http\Controllers\Controller;
use App\Models\QuoteResponse;
use App\Services\QuoteResponseService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuoteResponseController extends Controller
{
    private QuoteResponseService $quoteResponseService;

    public function __construct(QuoteResponseService $quoteResponseService)
    {
        $this->quoteResponseService = $quoteResponseService;
    }

    /**
     * QuoteResponse一覧表示
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'search', 'response_type']);
        $sort = [
            'field' => $request->get('sort_by', 'created_at'),
            'direction' => $request->get('sort_order', 'desc')
        ];

        $quoteResponses = $this->quoteResponseService->getPaginated($filters, $sort, $request->get('per_page', 20));

        return Inertia::render('Admin/QuoteResponses/Index', [
            'quoteResponses' => $quoteResponses,
            'filters' => $filters,
            'responseTypes' => QuoteResponse::RESPONSE_TYPES,
        ]);
    }

    /**
     * QuoteResponse詳細表示
     *
     * @param QuoteResponse $quoteResponse
     * @return Response
     */
    public function show(QuoteResponse $quoteResponse): Response
    {
        $quoteResponse = $this->quoteResponseService->getDetail($quoteResponse->id);

        // user_id がない場合、メールアドレスから User を検索して自動設定
        if (!$quoteResponse->user_id && $quoteResponse->email) {
            $user = \App\Models\User::where('email', $quoteResponse->email)->first();
            if ($user) {
                $quoteResponse->update(['user_id' => $user->id]);
                // ユーザーと会社情報を再ロード
                $quoteResponse->load(['user.profile', 'user.companies', 'company.addresses']);
            }
        } else {
            // user_id がある場合も profile と addresses を確実にロード
            $quoteResponse->load(['user.profile', 'user.companies', 'company.addresses']);
        }

        return Inertia::render('Admin/QuoteResponses/Show', [
            'quoteResponse' => $quoteResponse,
            'responseTypes' => QuoteResponse::RESPONSE_TYPES,
        ]);
    }

    /**
     * 招待メール送信
     *
     * @param QuoteResponse $quoteResponse
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendInvitation(QuoteResponse $quoteResponse): RedirectResponse
    {
        $quoteResponse = $this->quoteResponseService->getDetail($quoteResponse->id);

        // 既にユーザーが登録されている場合はスキップ
        if ($quoteResponse->user_id) {
            return back()->with('message', 'ユーザーは既に登録されています。');
        }

        try {
            $this->quoteResponseService->sendInvitationEmail($quoteResponse);
            return back()->with('success', __('messages.sent', ['attribute' => '招待メール']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => '招待メール送信', 'message' => $e->getMessage()]));
        }
    }

    /**
     * 管理者が内容を確認済みであることを記録する
     *
     * @param QuoteResponse $quoteResponse
     * @return RedirectResponse
     */
    public function markReviewed(QuoteResponse $quoteResponse): RedirectResponse
    {
        $this->quoteResponseService->markReviewed($quoteResponse, auth('admins')->id());

        return back()->with('success', '確認済みにしました。');
    }

    /**
     * 未回答の見積を管理者が目視確認のうえ手動で「見送り(NG)」として記録する
     *
     * @param Request $request
     * @param QuoteResponse $quoteResponse
     * @return RedirectResponse
     */
    public function markDeclined(Request $request, QuoteResponse $quoteResponse): RedirectResponse
    {
        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $this->quoteResponseService->markAsDeclined(
                $quoteResponse,
                auth('admins')->id(),
                $validated['note'] ?? null
            );

            return back()->with('success', __('messages.quote.no_response_recorded'));
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
