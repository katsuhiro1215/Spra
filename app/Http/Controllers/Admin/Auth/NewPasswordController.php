<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * パスワード再設定画面
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function create(Request $request): Response|RedirectResponse
    {
        // 既にログインしている場合はダッシュボードにリダイレクト
        if (Auth::guard('admins')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * 新しいパスワードの保存
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ], [
                'token.required' => __('validation.required', ['attribute' => 'トークン']),
                'email.required' => __('validation.required', ['attribute' => __('validation.attributes.email')]),
                'email.email' => __('validation.email', ['attribute' => __('validation.attributes.email')]),
                'password.required' => __('validation.required', ['attribute' => __('validation.attributes.password')]),
                'password.confirmed' => __('validation.confirmed', ['attribute' => __('validation.attributes.password')]),
            ]);

            // パスワードのリセット処理
            $status = Password::broker('admins')->reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user) use ($request) {
                    $user->forceFill([
                        'password' => Hash::make($request->password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return redirect()->route('admin.login')
                    ->with('success', __('passwords.reset'));
            }

            return back()->withInput($request->only('email'))
                ->withErrors(['email' => __($status)])
                ->with('error', __('passwords.token'));
        } catch (ValidationException $e) {
            return back()->withInput($request->only('email'))
                ->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('Admin password reset error: ' . $e->getMessage());

            return back()->withInput($request->only('email'))
                ->with('error', __('messages.general.action_failed'));
        }
    }
}
