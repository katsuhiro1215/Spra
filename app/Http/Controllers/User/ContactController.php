<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Admin;
use App\Notifications\ContactReceived;
use App\Services\ContactCategoryService;
use App\Services\ContactService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(
        private ContactService $contactService,
        private ContactCategoryService $categoryService
    ) {}

    /**
     * お問い合わせフォーム表示
     */
    public function index(): Response
    {
        $user = Auth::user();
        $profile = $user->profile;

        return Inertia::render('User/Contacts/Index', [
            'categories' => $this->categoryService->getActive(),
            'defaults' => [
                'name' => $profile
                    ? trim("{$profile->last_name}{$profile->first_name}")
                    : '',
                'email' => $user->email,
                'phone' => $profile->phone ?? '',
                'company' => $user->primaryCompany?->name ?? '',
            ],
        ]);
    }

    /**
     * お問い合わせ送信処理
     */
    public function send(StoreContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $contact = $this->contactService->createContact([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => 'new',
            'source' => 'user_dashboard',
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referrer' => $request->header('referer'),
        ]);

        $this->contactService->sendNotificationEmails($contact);

        Notification::send(Admin::all(), new ContactReceived($contact));

        return redirect()->route('user.contact.index')->with('success', 'お問い合わせを送信しました。');
    }
}
