<?php

namespace App\Models;

use App\Mail\TwoFactorCodeMail;
use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OneTimePassword extends Model
{
    use HasUlid;

    protected $fillable = [
        'authenticatable_type',
        'authenticatable_id',
        'code_hash',
        'expires_at',
        'attempts',
        'consumed_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'consumed_at' => 'datetime',
    ];

    const MAX_ATTEMPTS = 5;
    const VALID_MINUTES = 10;
    const RESEND_COOLDOWN_SECONDS = 60;

    public function authenticatable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * 対象（User/Admin）宛にワンタイムパスワードを生成し、メールを同期送信する。
     * キューワーカーの有無に関係なく届くよう、ここでは待機せずメールを送る。
     */
    public static function generateFor(User|Admin $authenticatable): self
    {
        // 未使用の古いコードは無効化する
        static::where('authenticatable_type', $authenticatable->getMorphClass())
            ->where('authenticatable_id', $authenticatable->id)
            ->whereNull('consumed_at')
            ->delete();

        $code = (string) random_int(100000, 999999);

        $otp = static::create([
            'authenticatable_type' => $authenticatable->getMorphClass(),
            'authenticatable_id' => $authenticatable->id,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(self::VALID_MINUTES),
            'attempts' => 0,
        ]);

        Mail::to($authenticatable->email)->send(new TwoFactorCodeMail($code));

        return $otp;
    }

    /**
     * 直近のコードが再送可能な状態か（クールダウン経過済みか）
     */
    public static function canResendFor(User|Admin $authenticatable): bool
    {
        $latest = static::where('authenticatable_type', $authenticatable->getMorphClass())
            ->where('authenticatable_id', $authenticatable->id)
            ->whereNull('consumed_at')
            ->latest('created_at')
            ->first();

        if (!$latest) {
            return true;
        }

        return $latest->created_at->addSeconds(self::RESEND_COOLDOWN_SECONDS)->isPast();
    }

    /**
     * コードを検証する。成功時は消費済みにする。
     */
    public static function verifyFor(User|Admin $authenticatable, string $code): bool
    {
        $otp = static::where('authenticatable_type', $authenticatable->getMorphClass())
            ->where('authenticatable_id', $authenticatable->id)
            ->whereNull('consumed_at')
            ->latest('created_at')
            ->first();

        if (!$otp || $otp->expires_at->isPast() || $otp->attempts >= self::MAX_ATTEMPTS) {
            return false;
        }

        if (!Hash::check($code, $otp->code_hash)) {
            $otp->increment('attempts');
            return false;
        }

        $otp->update(['consumed_at' => now()]);

        return true;
    }
}
