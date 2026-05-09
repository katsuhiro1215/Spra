<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteItem extends Model
{
    use HasUlid;

    protected $fillable = [
        'quote_id',
        'service_id',
        'service_plan_id',
        'service_item_id',
        'name',
        'description',
        'item_type',
        'billing_type',
        'quantity',
        'unit_price',
        'amount',
        'estimated_days',
        'sort_order',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'amount' => 'decimal:2',
        'estimated_days' => 'integer',
        'sort_order' => 'integer',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function servicePlan(): BelongsTo
    {
        return $this->belongsTo(ServicePlan::class);
    }

    public function serviceItem(): BelongsTo
    {
        return $this->belongsTo(ServiceItem::class);
    }

  // -------------------------
  // ヘルパーメソッド
  // -------------------------

    /**
     * 金額を計算（quantity × unit_price）
     */
    public function calculateAmount(): float
    {
        return round($this->quantity * $this->unit_price, 2);
    }

    /**
     * 金額を自動計算して保存
     */
    public function updateAmount(): void
    {
        $this->amount = $this->calculateAmount();
        $this->save();
    }

    /**
     * 単発契約かどうか
     */
    public function isOneTime(): bool
    {
        return $this->billing_type === 'one_time';
    }

    /**
     * 継続契約かどうか
     */
    public function isRecurring(): bool
    {
        return in_array($this->billing_type, ['monthly', 'quarterly', 'yearly']);
    }
}
