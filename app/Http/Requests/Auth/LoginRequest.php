<?php

namespace App\Http\Requests\Auth;

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
        } else {
            $guard = 'users';
        }

        $credentials = $this->only('email', 'password');

        if (! Auth::guard($guard)->validate($credentials)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());

        $authenticatable = Auth::guard($guard)->getProvider()->retrieveByCredentials($credentials);

        // 二段階認証が有効な場合は、ログインを確定せずコード入力を待つ
        if ($authenticatable->two_factor_enabled) {
            $this->session()->put('2fa_pending', [
                'guard' => $guard,
                'id' => $authenticatable->id,
                'remember' => $this->boolean('remember'),
            ]);

            \App\Models\OneTimePassword::generateFor($authenticatable);

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
