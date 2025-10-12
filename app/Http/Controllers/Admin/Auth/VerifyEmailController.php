<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    /**
     * メールアドレス確認
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        try {
            $admin = $request->user('admins');

            if ($admin->hasVerifiedEmail()) {
                return redirect()->route('admin.dashboard')
                    ->with('info', __('messages.auth.email_already_verified'));
            }

            if ($admin->markEmailAsVerified()) {
                event(new Verified($admin));
            }

            return redirect()->route('admin.dashboard')
                ->with('success', __('messages.auth.email_verified'));
        } catch (\Exception $e) {
            Log::error('Admin email verification error: ' . $e->getMessage());

            return redirect()->route('admin.login')
                ->with('error', __('messages.general.action_failed'));
        }
    }
}
