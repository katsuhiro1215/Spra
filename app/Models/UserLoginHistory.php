<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class UserLoginHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'browser_version',
        'platform',
        'platform_version',
        'country',
        'city',
        'session_id',
        'login_method',
        'is_successful',
        'failure_reason',
        'login_duration',
        'logged_in_at',
        'logged_out_at',
        'additional_data',
    ];

    protected $casts = [
        'is_successful' => 'boolean',
        'login_duration' => 'integer',
        'logged_in_at' => 'datetime',
        'logged_out_at' => 'datetime',
        'additional_data' => 'array',
    ];

    // ログインタイプの定数
    const TYPE_LOGIN = 'login';
    const TYPE_LOGOUT = 'logout';
    const TYPE_FAILED_LOGIN = 'failed_login';
    const TYPE_FORCED_LOGOUT = 'forced_logout';
    const TYPE_SESSION_EXPIRED = 'session_expired';

    // ログイン方法の定数
    const METHOD_PASSWORD = 'password';
    const METHOD_OAUTH = 'oauth';
    const METHOD_2FA = '2fa';
    const METHOD_SSO = 'sso';
    const METHOD_REMEMBER_TOKEN = 'remember_token';

    // デバイスタイプの定数
    const DEVICE_DESKTOP = 'desktop';
    const DEVICE_MOBILE = 'mobile';
    const DEVICE_TABLET = 'tablet';
    const DEVICE_UNKNOWN = 'unknown';

    // リレーション
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // スコープ
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeSuccessful($query)
    {
        return $query->where('is_successful', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('is_successful', false);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('logged_in_at', [$startDate, $endDate]);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('logged_in_at', '>=', Carbon::now()->subDays($days));
    }

    public function scopeToday($query)
    {
        return $query->whereDate('logged_in_at', Carbon::today());
    }

    public function scopeByIpAddress($query, $ipAddress)
    {
        return $query->where('ip_address', $ipAddress);
    }

    // アクセサ
    public function getTypeNameAttribute(): string
    {
        $types = [
            self::TYPE_LOGIN => 'ログイン',
            self::TYPE_LOGOUT => 'ログアウト',
            self::TYPE_FAILED_LOGIN => 'ログイン失敗',
            self::TYPE_FORCED_LOGOUT => '強制ログアウト',
            self::TYPE_SESSION_EXPIRED => 'セッション期限切れ',
        ];

        return $types[$this->type] ?? $this->type;
    }

    public function getLoginMethodNameAttribute(): string
    {
        $methods = [
            self::METHOD_PASSWORD => 'パスワード',
            self::METHOD_OAUTH => 'OAuth',
            self::METHOD_2FA => '二要素認証',
            self::METHOD_SSO => 'シングルサインオン',
            self::METHOD_REMEMBER_TOKEN => '自動ログイン',
        ];

        return $methods[$this->login_method] ?? $this->login_method;
    }

    public function getStatusColorAttribute(): string
    {
        if (!$this->is_successful) {
            return 'red';
        }

        return match ($this->type) {
            self::TYPE_LOGIN => 'green',
            self::TYPE_LOGOUT => 'blue',
            self::TYPE_FORCED_LOGOUT => 'orange',
            self::TYPE_SESSION_EXPIRED => 'yellow',
            default => 'gray'
        };
    }

    public function getLocationAttribute(): ?string
    {
        if ($this->city && $this->country) {
            return "{$this->city}, {$this->country}";
        }

        return $this->country;
    }

    public function getBrowserInfoAttribute(): ?string
    {
        if ($this->browser && $this->browser_version) {
            return "{$this->browser} {$this->browser_version}";
        }

        return $this->browser;
    }

    public function getPlatformInfoAttribute(): ?string
    {
        if ($this->platform && $this->platform_version) {
            return "{$this->platform} {$this->platform_version}";
        }

        return $this->platform;
    }

    public function getFormattedDurationAttribute(): ?string
    {
        if (!$this->login_duration) {
            return null;
        }

        $hours = floor($this->login_duration / 3600);
        $minutes = floor(($this->login_duration % 3600) / 60);
        $seconds = $this->login_duration % 60;

        if ($hours > 0) {
            return sprintf('%d時間%d分', $hours, $minutes);
        } elseif ($minutes > 0) {
            return sprintf('%d分%d秒', $minutes, $seconds);
        } else {
            return sprintf('%d秒', $seconds);
        }
    }

    // ヘルパーメソッド
    public static function recordLogin($userId, array $additionalData = []): self
    {
        $request = request();

        $data = array_merge([
            'user_id' => $userId,
            'type' => self::TYPE_LOGIN,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_id' => $request->session()?->getId(),
            'login_method' => self::METHOD_PASSWORD,
            'is_successful' => true,
            'logged_in_at' => now(),
        ], $additionalData);

        return self::create($data);
    }

    public static function recordLogout($userId, $sessionId = null): void
    {
        $history = self::where('user_id', $userId)
            ->where('type', self::TYPE_LOGIN)
            ->when($sessionId, fn($query) => $query->where('session_id', $sessionId))
            ->whereNull('logged_out_at')
            ->latest('logged_in_at')
            ->first();

        if ($history) {
            $loggedOutAt = now();
            $duration = $history->logged_in_at->diffInSeconds($loggedOutAt);

            $history->update([
                'logged_out_at' => $loggedOutAt,
                'login_duration' => $duration,
            ]);

            // ログアウト記録も作成
            self::create([
                'user_id' => $userId,
                'type' => self::TYPE_LOGOUT,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'session_id' => $sessionId,
                'is_successful' => true,
                'logged_in_at' => $loggedOutAt,
                'login_duration' => $duration,
            ]);
        }
    }

    public static function recordFailedLogin($userId = null, $reason = null): self
    {
        $request = request();

        return self::create([
            'user_id' => $userId,
            'type' => self::TYPE_FAILED_LOGIN,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_id' => $request->session()?->getId(),
            'login_method' => self::METHOD_PASSWORD,
            'is_successful' => false,
            'failure_reason' => $reason,
            'logged_in_at' => now(),
        ]);
    }

    public function isLogin(): bool
    {
        return $this->type === self::TYPE_LOGIN;
    }

    public function isLogout(): bool
    {
        return $this->type === self::TYPE_LOGOUT;
    }

    public function isFailedLogin(): bool
    {
        return $this->type === self::TYPE_FAILED_LOGIN;
    }

    public function isActive(): bool
    {
        return $this->isLogin() && $this->is_successful && is_null($this->logged_out_at);
    }
}
