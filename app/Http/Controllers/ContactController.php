<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Services\ContactService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReceivedMail;
use App\Mail\ContactNotificationMail;

/**
 * Public用お問い合わせコントローラー
 * 
 * Publicサイトからのお問い合わせ送信を処理
 */
class ContactController extends Controller
{
    public function __construct(
        private ContactService $contactService
    ) {}

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
            $contactData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'company' => $validated['company'] ?? null,
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'new',
                'source' => 'web',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referrer' => $request->header('referer'),
            ];

            // お問い合わせを保存
            $contact = $this->contactService->createContact($contactData);

            // お客様への自動返信メール送信
            try {
                Mail::to($contact->email)->send(new ContactReceivedMail($contact));
            } catch (\Exception $e) {
                Log::warning('自動返信メール送信失敗: ' . $e->getMessage(), [
                    'contact_id' => $contact->id,
                    'email' => $contact->email,
                ]);
            }

            // 管理者への通知メール送信
            try {
                $adminEmail = config('mail.admin_address', 'admin@example.com');
                Mail::to($adminEmail)->send(new ContactNotificationMail($contact));
            } catch (\Exception $e) {
                Log::warning('管理者通知メール送信失敗: ' . $e->getMessage(), [
                    'contact_id' => $contact->id,
                ]);
            }

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
