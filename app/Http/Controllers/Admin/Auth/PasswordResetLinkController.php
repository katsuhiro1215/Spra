<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * パスワードリセットリンク送信画面
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     * @throws \Exception
     */
    public function create(): RedirectResponse|Response
    {
        // 既にログイン済みの場合はダッシュボードにリダイレクト
        if (Auth::guard('admins')->check()) {
            return redirect_to_admin_home();
        }

        return Inertia::render('Admin/Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * パスワードリセットリンクの送信
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ], [
                'email.required' => __('validation.required', ['attribute' => __('validation.attributes.email')]),
                'email.email' => __('validation.email', ['attribute' => __('validation.attributes.email')]),
            ]);

            // パスワードリセットリンクの送信
            $status = Password::broker('admins')->sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return back()->with('success', __('passwords.sent'));
            }

            return back()->withInput($request->only('email'))
                ->withErrors(['email' => __($status)])
                ->with('error', __('passwords.throttled'));
        } catch (ValidationException $e) {
            return back()->withInput($request->only('email'))
                ->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('Admin password reset link error: ' . $e->getMessage());

            return back()->withInput($request->only('email'))
                ->with('error', __('messages.general.action_failed'));
        }
    }
}
