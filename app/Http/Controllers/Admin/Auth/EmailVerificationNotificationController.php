<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailVerificationNotificationController extends Controller
{
    /**
     * メールアドレス確認通知の再送
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $admin = $request->user('admins');

            if ($admin->hasVerifiedEmail()) {
                return redirect()->route('admin.dashboard')
                    ->with('info', __('messages.auth.email_already_verified'));
            }

            $admin->sendEmailVerificationNotification();

            return back()->with('success', __('messages.auth.verification_link_sent'));
        } catch (\Exception $e) {
            Log::error('Admin email verification notification error: ' . $e->getMessage());

            return back()->with('error', __('messages.general.action_failed'));
        }
    }
}
