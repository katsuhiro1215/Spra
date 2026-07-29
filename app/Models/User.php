<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use App\Models\Concerns\HasLoginLockout;
use App\Models\Concerns\HasTwoFactorAuthentication;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class User extends Authenticatable
{
    use HasUuid, HasFactory, Notifiable, SoftDeletes, HasLoginLockout, HasTwoFactorAuthentication;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'status',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
        'locked_until'      => 'datetime',
        'two_factor_secret' => 'encrypted',
        'two_factor_recovery_codes' => 'encrypted:array',
        'two_factor_confirmed_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function profile(): MorphOne
    {
        return $this->morphOne(Profile::class, 'profilable');
    }

    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function defaultAddress(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable')
            ->where('is_default', true)
            ->where('is_active', true);
    }

    public function voices(): HasMany
    {
        return $this->hasMany(Voice::class);
    }

    public function atlasMembership(): HasOne
    {
        return $this->hasOne(AtlasMembership::class);
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_user')
            ->using(CompanyUser::class)
            ->withPivot(['role', 'is_primary', 'joined_at', 'left_at'])
            ->withTimestamps();
    }

    /**
     * Primary company - Get the primary company associated with this user
     */
    public function company(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_user')
            ->using(CompanyUser::class)
            ->wherePivot('is_primary', true);
    }

    /**
     * Primary company (アクセサ) - is_primaryピボットがtrueの会社を1件返す。
     *
     * 旧実装は hasOne(Company::class, 'company_user', 'user_id') という誤った
     * リレーション定義で、company_user はピボットテーブル名であって companies
     * テーブルの外部キーカラムではないため、実際には常に空を返す不具合があった
     * （例外は発生せず気づきにくい）。company_user 中間テーブル経由のため
     * BelongsToMany の company() を使い、先頭1件をアクセサとして返す形に修正。
     */
    public function getPrimaryCompanyAttribute(): ?Company
    {
        return $this->company()->first();
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(UserActivityLog::class);
    }

    public function loginHistories(): HasMany
    {
        return $this->hasMany(UserLoginHistory::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(UserInvitation::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function quoteResponses(): HasMany
    {
        return $this->hasMany(QuoteResponse::class);
    }

    public function documentAcceptances(): HasMany
    {
        return $this->hasMany(UserAcceptance::class);
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeWithActiveContract($query)
    {
        return $query->whereHas('contracts', fn ($q) => $q->active());
    }

    // -------------------------
    // Helpers
    // -------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function hasActiveContract(): bool
    {
        return $this->contracts()->active()->exists();
    }

    public function updateLastLogin(): bool
    {
        return $this->update(['last_login_at' => now()]);
    }

    /**
     * Laravel標準の通知ではなく、ブランドデザインを適用したメールを送る
     * App\Notifications\UserResetPassword を使用する。
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Notifications\UserResetPassword($token));
    }
}
