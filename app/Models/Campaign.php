<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasUlid, SoftDeletes;

    public const DISCOUNT_TYPES = [
        'percentage' => '定率(%)',
        'fixed' => '固定額(円)',
    ];

    protected $fillable = [
        'name',
        'code',
        'description',
        'media_id',
        'discount_type',
        'discount_value',
        'starts_at',
        'ends_at',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'status_label',
        'discount_type_label',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
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
    // スコープ
    // -------------------------

    public function scopeCurrentlyRunning($query)
    {
        $now = now();

        return $query->where('is_active', true)
            ->where('starts_at', '<=', $now)
            ->where('ends_at', '>=', $now);
    }

    // -------------------------
    // ヘルパー
    // -------------------------

    /**
     * 現時点でこのキャンペーンが適用可能か
     */
    public function isCurrentlyActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        return $now->gte($this->starts_at) && $now->lte($this->ends_at);
    }

    /**
     * 基準額に対する割引額を算出（総額を下回らないようclampする）
     */
    public function calculateDiscount(float $baseAmount): float
    {
        if ($this->discount_type === 'percentage') {
            return round($baseAmount * ((float) $this->discount_value / 100));
        }

        return min((float) $this->discount_value, $baseAmount);
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->is_active) {
                    return '停止中';
                }

                $now = now();

                if ($now->lt($this->starts_at)) {
                    return '開催前';
                }

                if ($now->gt($this->ends_at)) {
                    return '終了';
                }

                return '開催中';
            }
        );
    }

    protected function discountTypeLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => self::DISCOUNT_TYPES[$this->discount_type] ?? $this->discount_type
        );
    }
}
