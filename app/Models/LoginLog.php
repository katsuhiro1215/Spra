<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LoginLog extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'action',
        'user_type',
        'user_id',
        'email',
        'guard',
        'auth_method',
        'social_provider',
        'failure_reason',
        'attempt_count',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'os',
        'country',
        'city',
        'session_id',
        'session_expires_at',
        'is_suspicious',
        'requires_2fa',
        'is_blocked',
    ];

    protected $casts = [
        'session_expires_at' => 'datetime',
        'is_suspicious' => 'boolean',
        'requires_2fa' => 'boolean',
        'is_blocked' => 'boolean',
    ];

    // アクションの定数
    const ACTION_ATTEMPT = 'login_attempt';
    const ACTION_SUCCESS = 'login_success';
    const ACTION_FAILED = 'login_failed';
    const ACTION_LOGOUT = 'logout';
    const ACTION_SESSION_EXPIRED = 'session_expired';
    const ACTION_FORCED_LOGOUT = 'forced_logout';

    // ユーザー種別の定数
    const USER_TYPE_ADMIN = 'admin';
    const USER_TYPE_USER = 'user';

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeByUserType($query, string $userType)
    {
        return $query->where('user_type', $userType);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays($days));
    }

    // -------------------------
    // Accessors
    // -------------------------

    public function getActionNameAttribute(): string
    {
        return match ($this->action) {
            self::ACTION_ATTEMPT => 'ログイン試行',
            self::ACTION_SUCCESS => 'ログイン成功',
            self::ACTION_FAILED => 'ログイン失敗',
            self::ACTION_LOGOUT => 'ログアウト',
            self::ACTION_SESSION_EXPIRED => 'セッション期限切れ',
            self::ACTION_FORCED_LOGOUT => '強制ログアウト',
            default => $this->action,
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->action) {
            self::ACTION_SUCCESS => 'green',
            self::ACTION_LOGOUT => 'blue',
            self::ACTION_FAILED => 'red',
            self::ACTION_FORCED_LOGOUT => 'orange',
            self::ACTION_SESSION_EXPIRED => 'yellow',
            default => 'gray',
        };
    }

    // -------------------------
    // Helpers
    // -------------------------

    /**
     * ログイン成功を記録
     */
    public static function recordSuccess(string $guard, string $userType, string $userId, string $email, array $extra = []): self
    {
        return static::create([
            ...$extra,
            'action' => self::ACTION_SUCCESS,
            'user_type' => $userType,
            'user_id' => $userId,
            'email' => $email,
            'guard' => $guard,
            'auth_method' => 'password',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'session_id' => request()->session()?->getId(),
        ]);
    }

    /**
     * ログイン失敗を記録
     */
    public static function recordFailed(string $guard, string $userType, ?string $email, ?string $reason = null): self
    {
        return static::create([
            'action' => self::ACTION_FAILED,
            'user_type' => $userType,
            'email' => $email ?? '',
            'guard' => $guard,
            'auth_method' => 'password',
            'failure_reason' => $reason,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * ログアウトを記録
     */
    public static function recordLogout(string $guard, string $userType, string $userId, string $email): self
    {
        return static::create([
            'action' => self::ACTION_LOGOUT,
            'user_type' => $userType,
            'user_id' => $userId,
            'email' => $email,
            'guard' => $guard,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'session_id' => request()->session()?->getId(),
        ]);
    }
}
