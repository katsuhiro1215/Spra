<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserInvitation extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'contact_id',
        'email',
        'token',
        'expires_at',
        'status',
        'used_at',
        'user_id',
        'invited_by',
        'notes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    // -------------------------
    // Constants
    // -------------------------

    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_REVOKED = 'revoked';

    public const STATUSES = [
        self::STATUS_PENDING => '招待中',
        self::STATUS_ACCEPTED => '承認済み',
        self::STATUS_EXPIRED => '期限切れ',
        self::STATUS_REVOKED => '取り消し済み',
    ];

    // デフォルトの有効期限（日数）
    public const DEFAULT_EXPIRY_DAYS = 7;

    // -------------------------
    // Relationships
    // -------------------------

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'invited_by');
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', self::STATUS_ACCEPTED);
    }

    public function scopeValid($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('expires_at', '<=', now());
    }

    // -------------------------
    // Helper Methods
    // -------------------------

    /**
     * 新しい招待トークンを生成
     */
    public static function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * デフォルトの有効期限を取得
     */
    public static function getDefaultExpiryDate(): Carbon
    {
        return now()->addDays(self::DEFAULT_EXPIRY_DAYS);
    }

    /**
     * 招待が有効かチェック
     */
    public function isValid(): bool
    {
        return $this->status === self::STATUS_PENDING
            && $this->expires_at > now();
    }

    /**
     * 招待が期限切れかチェック
     */
    public function isExpired(): bool
    {
        return $this->status === self::STATUS_PENDING
            && $this->expires_at <= now();
    }

    /**
     * 招待が承認済みかチェック
     */
    public function isAccepted(): bool
    {
        return $this->status === self::STATUS_ACCEPTED;
    }

    /**
     * 招待を承認済みにマーク
     */
    public function markAsAccepted(User $user): bool
    {
        return $this->update([
            'status' => self::STATUS_ACCEPTED,
            'used_at' => now(),
            'user_id' => $user->id,
        ]);
    }

    /**
     * 招待を取り消し
     */
    public function revoke(): bool
    {
        return $this->update([
            'status' => self::STATUS_REVOKED,
        ]);
    }

    /**
     * 期限切れの招待を自動更新
     */
    public static function updateExpiredInvitations(): int
    {
        return self::where('status', self::STATUS_PENDING)
            ->where('expires_at', '<=', now())
            ->update(['status' => self::STATUS_EXPIRED]);
    }

    /**
     * ステータスのラベルを取得
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    /**
     * 招待リンクURLを取得
     */
    public function getInvitationUrlAttribute(): string
    {
        return route('user.register.invited', ['token' => $this->token]);
    }
}
