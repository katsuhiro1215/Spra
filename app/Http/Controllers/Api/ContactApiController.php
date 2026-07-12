<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ContactCategoryService;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * 外部サイト(WordPress等)からのお問い合わせAPI連携コントローラー
 * VerifyContactApiKey ミドルウェアで認証済みのリクエストのみ到達する
 */
class ContactApiController extends Controller
{
    public function __construct(
        private ContactService $contactService,
        private ContactCategoryService $categoryService
    ) {}

    /**
     * 連携先のフォームに表示するお問い合わせカテゴリ一覧を返す
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'categories' => $this->categoryService->getActive()->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
            ]),
        ]);
    }

    /**
     * 外部サイトからのお問い合わせを受け付ける
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'company' => ['nullable', 'string', 'max:255'],
            'contact_category_id' => ['required', 'exists:contact_categories,id'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            // 連携元(WordPress等)が $_SERVER から転送する実訪問者の情報
            // サーバー間通信のため $request->ip() 等はWordPressサーバー自身の値になってしまう
            'page_url' => ['nullable', 'string', 'max:2048'],
            'visitor_ip' => ['nullable', 'string', 'max:45'],
            'visitor_user_agent' => ['nullable', 'string', 'max:512'],
        ]);

        $apiClient = $request->attributes->get('contactApiClient');

        try {
            $contact = $this->contactService->createContact([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'company' => $validated['company'] ?? null,
                'contact_category_id' => $validated['contact_category_id'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'new',
                'source' => 'wordpress',
                'api_client_id' => $apiClient?->id,
                'referrer' => $validated['page_url'] ?? null,
                'ip' => $validated['visitor_ip'] ?? $request->ip(),
                'user_agent' => $validated['visitor_user_agent'] ?? $request->userAgent(),
            ]);

            $this->contactService->sendNotificationEmails($contact);

            Log::info('外部API経由でお問い合わせを受信しました', [
                'contact_id' => $contact->id,
                'api_client_id' => $apiClient?->id,
            ]);

            return response()->json(['success' => true, 'contact_id' => $contact->id]);
        } catch (\Exception $e) {
            Log::error('外部APIお問い合わせ送信エラー: ' . $e->getMessage(), [
                'api_client_id' => $apiClient?->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['success' => false, 'message' => 'お問い合わせの登録に失敗しました。'], 500);
        }
    }
}
