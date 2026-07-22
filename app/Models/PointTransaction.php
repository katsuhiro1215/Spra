<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PointTransaction extends Model
{
    use HasUlid;

    public const TYPES = [
        'purchase' => '通常ポイント',
        'bonus' => 'ボーナスポイント',
        'referral' => '紹介ポイント',
        'adjustment' => '調整',
        'redemption' => 'ポイント交換',
    ];

    protected $fillable = [
        'company_id',
        'points',
        'type',
        'point_reward_id',
        'receipt_id',
        'referral_id',
        'redemption_id',
        'description',
        'balance_after',
        'created_by',
    ];

    protected $casts = [
        'points' => 'integer',
        'balance_after' => 'integer',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function pointReward(): BelongsTo
    {
        return $this->belongsTo(PointReward::class);
    }

    public function receipt(): BelongsTo
    {
        return $this->belongsTo(Receipt::class);
    }

    public function referral(): BelongsTo
    {
        return $this->belongsTo(Referral::class);
    }

    public function redemption(): BelongsTo
    {
        return $this->belongsTo(PointRedemption::class, 'redemption_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
