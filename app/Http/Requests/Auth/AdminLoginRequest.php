<?php

namespace App\Http\Requests\Auth;

use App\Models\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Validation\ValidationException;

class AdminLoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * バリデーションエラーメッセージ
     */
    public function messages(): array
    {
        return [
            'email.required' => 'メールアドレスを入力してください。',
            'email.string' => 'メールアドレスは文字列で入力してください。',
            'email.email' => '有効なメールアドレスを入力してください。',
            'password.required' => 'パスワードを入力してください。',
            'password.string' => 'パスワードは文字列で入力してください。',
        ];
    }

    /**
     * ログイン認証
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $admin = Admin::where('email', $this->string('email'))->first();

        if ($admin && $admin->isLocked()) {
            throw ValidationException::withMessages([
                'email' => __('messages.auth.account_locked', [
                    'minutes' => $admin->locked_until->diffInMinutes(now()) + 1,
                ]),
            ]);
        }

        $credentials = $this->only('email', 'password');

        if (! Auth::guard('admins')->validate($credentials)) {
            RateLimiter::hit($this->throttleKey());
            $admin?->registerFailedLogin();

            event(new Failed('admins', $admin, $credentials));

            throw ValidationException::withMessages([
                'email' => __('messages.auth.login_failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        $admin->resetFailedLogins();

        // 二段階認証が有効な場合は、ログインを確定せずコード入力を待つ
        if ($admin->two_factor_enabled) {
            $this->session()->put('2fa_pending', [
                'guard' => 'admins',
                'id' => $admin->id,
                'remember' => $this->boolean('remember'),
            ]);

            // TOTP(認証アプリ)は端末側でコードが生成されるため、メール送信は行わない
            if ($admin->twoFactorMethod() !== \App\Models\Admin::TWO_FACTOR_METHOD_TOTP) {
                \App\Models\OneTimePassword::generateFor($admin);
            }

            return;
        }

        Auth::guard('admins')->login($admin, $this->boolean('remember'));
    }

    /**
     * ログインリクエストレート制限確認
     *
     * より厳しい制限を設定(3回まで)
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 3)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('messages.auth.throttle', ['seconds' => $seconds]),
        ]);
    }

    /**
     * ログインリクエストスロットルキー取得
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
