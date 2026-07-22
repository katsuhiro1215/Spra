<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * 二段階認証の方式（メールOTP/TOTP）とリカバリーコードを扱う
 * two_factor_enabled は既存の互換のため引き続きマスタースイッチとして使う
 */
trait HasTwoFactorAuthentication
{
    const TWO_FACTOR_METHOD_EMAIL = 'email';
    const TWO_FACTOR_METHOD_TOTP = 'totp';

    /**
     * 二段階認証の方式（未設定時は既存互換のためemail扱い）
     */
    public function twoFactorMethod(): string
    {
        return $this->two_factor_method ?? self::TWO_FACTOR_METHOD_EMAIL;
    }

    public function usesTotp(): bool
    {
        return $this->two_factor_enabled
            && $this->twoFactorMethod() === self::TWO_FACTOR_METHOD_TOTP
            && $this->two_factor_secret !== null;
    }

    /**
     * リカバリーコードを新規生成し、ハッシュ化して保存する
     * 平文はこの呼び出し時にしか取得できない
     *
     * @return array<int, string>
     */
    public function generateRecoveryCodes(): array
    {
        $plainCodes = collect(range(1, 8))->map(function () {
            return Str::upper(Str::random(4) . '-' . Str::random(4));
        })->all();

        $this->two_factor_recovery_codes = array_map(
            fn (string $code) => Hash::make($code),
            $plainCodes
        );
        $this->save();

        return $plainCodes;
    }

    /**
     * リカバリーコードを検証し、一致したものは使い捨てとして削除する
     */
    public function redeemRecoveryCode(string $code): bool
    {
        $hashedCodes = $this->two_factor_recovery_codes ?? [];

        foreach ($hashedCodes as $index => $hashedCode) {
            if (Hash::check($code, $hashedCode)) {
                unset($hashedCodes[$index]);
                $this->two_factor_recovery_codes = array_values($hashedCodes);
                $this->save();

                return true;
            }
        }

        return false;
    }

    public function remainingRecoveryCodesCount(): int
    {
        return count($this->two_factor_recovery_codes ?? []);
    }

    /**
     * 二段階認証を完全に無効化する（方式・シークレット・リカバリーコードを全てクリア）
     */
    public function disableTwoFactor(): void
    {
        $this->two_factor_enabled = false;
        $this->two_factor_method = null;
        $this->two_factor_secret = null;
        $this->two_factor_recovery_codes = null;
        $this->two_factor_confirmed_at = null;
        $this->save();
    }
}
