<?php

namespace App\Models\Concerns;

/**
 * メール+IP単位のRateLimiterとは別に、アカウント単位（IPを問わない）で
 * 連続ログイン失敗回数を記録し、一定回数を超えたら一時的にロックする
 */
trait HasLoginLockout
{
    /**
     * このロック回数を超えたらロックする
     */
    public static function maxFailedLoginAttempts(): int
    {
        return 10;
    }

    /**
     * ロック時間（分）
     */
    public static function lockoutMinutes(): int
    {
        return 30;
    }

    public function isLocked(): bool
    {
        return $this->locked_until !== null && $this->locked_until->isFuture();
    }

    public function registerFailedLogin(): void
    {
        $this->failed_login_attempts = ($this->failed_login_attempts ?? 0) + 1;

        if ($this->failed_login_attempts >= static::maxFailedLoginAttempts()) {
            $this->locked_until = now()->addMinutes(static::lockoutMinutes());
            $this->failed_login_attempts = 0;
        }

        $this->save();
    }

    public function resetFailedLogins(): void
    {
        if ($this->failed_login_attempts !== 0 || $this->locked_until !== null) {
            $this->failed_login_attempts = 0;
            $this->locked_until = null;
            $this->save();
        }
    }
}
