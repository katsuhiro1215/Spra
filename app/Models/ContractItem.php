<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 契約明細
 * 
 * QuoteItemからスナップショットとしてコピーされる
 */
class ContractItem extends Model
{
    use HasUlid;

    protected $fillable = [
        'contract_version_id',
        'service_id',
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

    /**
     * 契約バージョン
     */
    public function contractVersion(): BelongsTo
    {
        return $this->belongsTo(ContractVersion::class);
    }

    /**
     * サービス
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * サービスアイテム
     */
    public function serviceItem(): BelongsTo
    {
        return $this->belongsTo(ServiceItem::class);
    }
}
