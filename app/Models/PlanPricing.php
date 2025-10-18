<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class PlanPricing extends Model
{
    protected $fillable = [
        'service_plan_id',
        'name',
        'type',
        'description',
        'price',
        'price_unit',
        'billing_type',
        'min_quantity',
        'max_quantity',
        'tier_rules',
        'tier_start_quantity',
        'tier_end_quantity',
        'discount_percentage',
        'discount_amount',
        'discount_start_date',
        'discount_end_date',
        'conditions',
        'requires_approval',
        'approval_notes',
        'is_default',
        'is_negotiable',
        'is_recurring',
        'recurring_months',
        'is_visible',
        'is_featured',
        'sort_order',
        'display_name',
        'is_active',
        'effective_from',
        'effective_until',
        'created_by',
        'updated_by',
        'notes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'min_quantity' => 'decimal:2',
        'max_quantity' => 'decimal:2',
        'tier_start_quantity' => 'decimal:2',
        'tier_end_quantity' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tier_rules' => 'array',
        'conditions' => 'array',
        'discount_start_date' => 'date',
        'discount_end_date' => 'date',
        'effective_from' => 'datetime',
        'effective_until' => 'datetime',
        'is_default' => 'boolean',
        'is_negotiable' => 'boolean',
        'is_recurring' => 'boolean',
        'requires_approval' => 'boolean',
        'is_visible' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'recurring_months' => 'integer',
    ];

    /**
     * リレーション：ServicePlan
     */
    public function servicePlan(): BelongsTo
    {
        return $this->belongsTo(ServicePlan::class);
    }

    /**
     * リレーション：作成者
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * リレーション：更新者
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * スコープ：アクティブな価格設定のみ
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * スコープ：現在有効な価格設定
     */
    public function scopeEffective(Builder $query): Builder
    {
        $now = Carbon::now();
        return $query->where(function ($q) use ($now) {
            $q->whereNull('effective_from')
                ->orWhere('effective_from', '<=', $now);
        })->where(function ($q) use ($now) {
            $q->whereNull('effective_until')
                ->orWhere('effective_until', '>=', $now);
        });
    }

    /**
     * スコープ：表示可能な価格設定
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    /**
     * スコープ：価格タイプで絞り込み
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * スコープ：デフォルト価格設定
     */
    public function scopeDefault(Builder $query): Builder
    {
        return $query->where('is_default', true);
    }

    /**
     * スコープ：ソート順
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * アクセサ：フォーマット済み価格
     */
    public function getFormattedPriceAttribute(): string
    {
        $formatted = '¥' . number_format($this->price);

        if ($this->price_unit) {
            $formatted .= ' / ' . $this->price_unit;
        }

        return $formatted;
    }

    /**
     * アクセサ：表示名（display_nameがない場合はnameを使用）
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->attributes['display_name'] ?: $this->name;
    }

    /**
     * アクセサ：割引率の適用後価格
     */
    public function getDiscountedPriceAttribute(): float
    {
        $price = $this->price;

        if ($this->isDiscountActive()) {
            if ($this->discount_percentage) {
                $price = $price * (1 - $this->discount_percentage / 100);
            } elseif ($this->discount_amount) {
                $price = max(0, $price - $this->discount_amount);
            }
        }

        return round($price, 2);
    }

    /**
     * アクセサ：フォーマット済み割引後価格
     */
    public function getFormattedDiscountedPriceAttribute(): string
    {
        $formatted = '¥' . number_format($this->discounted_price);

        if ($this->price_unit) {
            $formatted .= ' / ' . $this->price_unit;
        }

        return $formatted;
    }

    /**
     * 割引が現在有効かチェック
     */
    public function isDiscountActive(): bool
    {
        if (!$this->discount_percentage && !$this->discount_amount) {
            return false;
        }

        $now = Carbon::now()->toDateString();

        if ($this->discount_start_date && $this->discount_start_date > $now) {
            return false;
        }

        if ($this->discount_end_date && $this->discount_end_date < $now) {
            return false;
        }

        return true;
    }

    /**
     * 現在価格設定が有効かチェック
     */
    public function isCurrentlyEffective(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();

        if ($this->effective_from && $this->effective_from > $now) {
            return false;
        }

        if ($this->effective_until && $this->effective_until < $now) {
            return false;
        }

        return true;
    }

    /**
     * 数量に基づく価格計算（段階料金対応）
     */
    public function calculatePrice(float $quantity = 1): float
    {
        $basePrice = $this->discounted_price;

        switch ($this->billing_type) {
            case 'fixed':
                return $basePrice;

            case 'per_unit':
                return $basePrice * $quantity;

            case 'tiered':
                return $this->calculateTieredPrice($quantity);

            case 'volume':
                return $this->calculateVolumePrice($quantity);

            default:
                return $basePrice;
        }
    }

    /**
     * 段階料金の計算
     */
    private function calculateTieredPrice(float $quantity): float
    {
        if (!$this->tier_rules || !is_array($this->tier_rules)) {
            return $this->discounted_price * $quantity;
        }

        $totalPrice = 0;
        $remainingQuantity = $quantity;

        foreach ($this->tier_rules as $tier) {
            $tierQuantity = min($remainingQuantity, $tier['max_quantity'] - $tier['min_quantity'] + 1);
            $totalPrice += $tierQuantity * $tier['price'];
            $remainingQuantity -= $tierQuantity;

            if ($remainingQuantity <= 0) {
                break;
            }
        }

        return $totalPrice;
    }

    /**
     * ボリューム料金の計算
     */
    private function calculateVolumePrice(float $quantity): float
    {
        if (!$this->tier_rules || !is_array($this->tier_rules)) {
            return $this->discounted_price * $quantity;
        }

        // 該当する価格帯を見つける
        foreach ($this->tier_rules as $tier) {
            if (
                $quantity >= $tier['min_quantity'] &&
                ($tier['max_quantity'] === null || $quantity <= $tier['max_quantity'])
            ) {
                return $tier['price'] * $quantity;
            }
        }

        // 該当する価格帯がない場合はベース価格を使用
        return $this->discounted_price * $quantity;
    }

    /**
     * 価格タイプのラベル取得
     */
    public function getTypeLabel(): string
    {
        $labels = [
            'base' => '基本価格',
            'addon' => '追加オプション',
            'discount' => '割引価格',
            'tier' => '段階料金',
        ];

        return $labels[$this->type] ?? $this->type;
    }

    /**
     * 課金タイプのラベル取得
     */
    public function getBillingTypeLabel(): string
    {
        $labels = [
            'fixed' => '固定料金',
            'per_unit' => '単位料金',
            'tiered' => '段階料金',
            'volume' => 'ボリューム料金',
        ];

        return $labels[$this->billing_type] ?? $this->billing_type;
    }
}
