<?php

namespace App\Http\Requests\Auth;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * ユーザーリクエスト権限
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
     * ログイン認証
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if ($this->routeIs('admin.*')) {
            $guard = 'admins';
            $modelClass = Admin::class;
        } else {
            $guard = 'users';
            $modelClass = User::class;
        }

        $authenticatable = $modelClass::where('email', $this->string('email'))->first();

        if ($authenticatable && $authenticatable->isLocked()) {
            throw ValidationException::withMessages([
                'email' => __('messages.auth.account_locked', [
                    'minutes' => $authenticatable->locked_until->diffInMinutes(now()) + 1,
                ]),
            ]);
        }

        $credentials = $this->only('email', 'password');

        if (! Auth::guard($guard)->validate($credentials)) {
            RateLimiter::hit($this->throttleKey());
            $authenticatable?->registerFailedLogin();

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        $authenticatable->resetFailedLogins();

        // 二段階認証が有効な場合は、ログインを確定せずコード入力を待つ
        if ($authenticatable->two_factor_enabled) {
            $this->session()->put('2fa_pending', [
                'guard' => $guard,
                'id' => $authenticatable->id,
                'remember' => $this->boolean('remember'),
            ]);

            // TOTP(認証アプリ)は端末側でコードが生成されるため、メール送信は行わない
            if ($authenticatable->twoFactorMethod() !== \App\Models\Admin::TWO_FACTOR_METHOD_TOTP) {
                \App\Models\OneTimePassword::generateFor($authenticatable);
            }

            return;
        }

        Auth::guard($guard)->login($authenticatable, $this->boolean('remember'));
    }

    /**
     * ログインリクエストレート制限確認
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * ログインリクエストスロットルキー取得
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
