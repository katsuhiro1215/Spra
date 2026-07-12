<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Services\ContactService;
use App\Services\ContactCategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public用お問い合わせコントローラー
 *
 * Publicサイトからのお問い合わせ送信を処理
 */
class ContactController extends Controller
{
    public function __construct(
        private ContactService $contactService,
        private ContactCategoryService $categoryService
    ) {}

    /**
     * お問い合わせフォームを表示
     */
    public function index(): Response
    {
        $categories = $this->categoryService->getActive();

        return Inertia::render('Public/Contact', [
            'categories' => $categories,
        ]);
    }

    /**
     * お問い合わせを送信
     *
     * @param StoreContactRequest $request
     * @return RedirectResponse
     */
    public function store(StoreContactRequest $request): RedirectResponse
    {
        try {
            // バリデーション済みのデータを取得
            $validated = $request->validated();

            // トラッキング情報を追加
            $contactData = array_merge($validated, [
                'status' => 'new',
                'source' => 'public',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referrer' => $request->header('referer'),
            ]);

            // Service層を通じてお問い合わせを保存
            $contact = $this->contactService->createContact($contactData);

            // メール送信
            $this->contactService->sendNotificationEmails($contact);

            // 管理者への通知（ベルアイコン）
            \Illuminate\Support\Facades\Notification::send(
                \App\Models\Admin::all(),
                new \App\Notifications\ContactReceived($contact)
            );

            // ログに記録
            \App\Models\UserActivityLog::logActivity([
                'action' => \App\Models\UserActivityLog::ACTION_CONTACT_RECEIVED,
                'description' => "{$contact->name}様よりお問い合わせを受信しました（{$contact->subject}）",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => \App\Models\UserActivityLog::STATUS_SUCCESS,
            ]);

            Log::info('お問い合わせを受信しました', [
                'contact_id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
            ]);

            return redirect()
                ->back()
                ->with('success', 'お問い合わせを受け付けました。確認メールをお送りしましたのでご確認ください。2営業日以内にご返信いたします。');
        } catch (\Exception $e) {
            Log::error('お問い合わせ送信エラー: ' . $e->getMessage(), [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'お問い合わせの送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。');
        }
    }
}
