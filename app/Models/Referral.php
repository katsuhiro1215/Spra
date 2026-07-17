<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Referral extends Model
{
    use HasUlid, SoftDeletes;

    public const STATUSES = [
        'pending' => '未成約',
        'contracted' => '成立済み',
        'expired' => '期限切れ',
        'cancelled' => '取消',
    ];

    protected $fillable = [
        'referrer_company_id',
        'referred_company_id',
        'referred_contact_id',
        'referral_code',
        'status',
        'referrer_points',
        'referred_points',
        'contracted_at',
        'referrer_rewarded_at',
        'referred_rewarded_at',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'referrer_points' => 'integer',
        'referred_points' => 'integer',
        'contracted_at' => 'datetime',
        'referrer_rewarded_at' => 'datetime',
        'referred_rewarded_at' => 'datetime',
    ];

    protected $appends = [
        'status_label',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function referrerCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'referrer_company_id');
    }

    public function referredCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'referred_company_id');
    }

    public function referredContact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'referred_contact_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PointTransaction::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // -------------------------
    // ヘルパー
    // -------------------------

    public function isFullyRewarded(): bool
    {
        return $this->referrer_rewarded_at !== null
            && ($this->referred_company_id === null || $this->referred_rewarded_at !== null);
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => self::STATUSES[$this->status] ?? $this->status
        );
    }
}
