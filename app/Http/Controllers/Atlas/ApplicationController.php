<?php

namespace App\Http\Controllers\Atlas;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAtlasApplicationRequest;
use App\Models\ContactCategory;
use App\Services\ContactService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Atlas利用申込みコントローラー(Public - ログイン不要)
 *
 * 審査・承認・課金プランの管理は対象外。申込み内容をContactとして
 * 保存し、既存のContact通知メール・管理画面をそのまま流用する。
 */
class ApplicationController extends Controller
{
    public function __construct(
        private ContactService $contactService,
    ) {}

    public function create(): Response
    {
        return Inertia::render('Public/AtlasApply');
    }

    public function store(StoreAtlasApplicationRequest $request): RedirectResponse
    {
        try {
            $category = ContactCategory::where('slug', ContactCategory::SLUG_ATLAS_APPLY)->firstOrFail();

            $validated = $request->validated();

            $contactData = array_merge($validated, [
                // contacts.messageはNOT NULL制約のため、任意項目のまま未入力時は既定文言で補う
                'message' => ($validated['message'] ?? null) ?: '（本文の記入はありませんでした）',
                'contact_category_id' => $category->id,
                'subject' => 'Atlas利用申込み',
                'status' => 'new',
                'source' => 'atlas_apply',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referrer' => $request->header('referer'),
            ]);

            $contact = $this->contactService->createContact($contactData);

            $this->contactService->sendNotificationEmails($contact);

            \Illuminate\Support\Facades\Notification::send(
                \App\Models\Admin::all(),
                new \App\Notifications\ContactReceived($contact)
            );

            return redirect()
                ->back()
                ->with('success', 'お申込みを受け付けました。担当者よりご連絡いたします。');
        } catch (\Exception $e) {
            Log::error('Atlas利用申込み送信エラー: ' . $e->getMessage());

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'お申込みの送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。');
        }
    }
}
