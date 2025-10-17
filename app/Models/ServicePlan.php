<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class ServicePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'service_type_id',
        'description',
        'detailed_description',
        'base_price',
        'price_unit',
        'billing_cycle',
        'setup_fee',
        'features',
        'included_items',
        'limitations',
        'max_revisions',
        'estimated_delivery_days',
        'is_popular',
        'is_recommended',
        'sort_order',
        'is_active',
        'color',
        'badge_text',
        'icon',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'features' => 'array',
        'included_items' => 'array',
        'limitations' => 'array',
        'base_price' => 'decimal:2',
        'setup_fee' => 'decimal:2',
        'max_revisions' => 'integer',
        'estimated_delivery_days' => 'integer',
        'sort_order' => 'integer',
        'is_popular' => 'boolean',
        'is_recommended' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'billing_cycle' => 'one_time',
        'setup_fee' => 0,
        'is_popular' => false,
        'is_recommended' => false,
        'sort_order' => 0,
        'is_active' => true,
    ];

    /**
     * ServiceTypeとのリレーション
     */
    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    /**
     * 作成者とのリレーション
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * 更新者とのリレーション
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * スコープ: アクティブなプランのみ
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * スコープ: 人気プランのみ
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    /**
     * スコープ: 推奨プランのみ
     */
    public function scopeRecommended($query)
    {
        return $query->where('is_recommended', true);
    }

    /**
     * スコープ: 特定のサービスタイプのプラン
     */
    public function scopeForServiceType($query, $serviceTypeId)
    {
        return $query->where('service_type_id', $serviceTypeId);
    }

    /**
     * スコープ: 表示順でソート
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('base_price');
    }

    /**
     * 価格をフォーマット済み文字列で取得
     */
    public function getFormattedPriceAttribute(): string
    {
        if (!$this->base_price) {
            return '要相談';
        }

        $price = '¥' . number_format($this->base_price);

        if ($this->price_unit) {
            $price .= '/' . $this->price_unit;
        }

        return $price;
    }

    /**
     * 初期費用をフォーマット済み文字列で取得
     */
    public function getFormattedSetupFeeAttribute(): string
    {
        if ($this->setup_fee == 0) {
            return '無料';
        }

        return '¥' . number_format($this->setup_fee);
    }

    /**
     * 請求サイクルの日本語表示
     */
    public function getBillingCycleJaAttribute(): string
    {
        return match ($this->billing_cycle) {
            'one_time' => '一回払い',
            'monthly' => '月額',
            'quarterly' => '四半期',
            'yearly' => '年額',
            default => $this->billing_cycle,
        };
    }

    /**
     * 自動でslugを生成
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($plan) {
            if (empty($plan->slug)) {
                $plan->slug = Str::slug($plan->name);
            }
        });

        static::updating(function ($plan) {
            if ($plan->isDirty('name') && empty($plan->slug)) {
                $plan->slug = Str::slug($plan->name);
            }
        });
    }
}
