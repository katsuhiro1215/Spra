<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 契約書バージョン
 * 
 * Contractの各バージョンを管理
 * テキスト修正や金額変更の履歴として、すべてのバージョンを保持
 */
class ContractVersion extends Model
{
    use HasUlid, HasFactory;

    // ステータス定数
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING_REVIEW = 'pending_review';
    const STATUS_APPROVED = 'approved';
    const STATUS_SENT = 'sent';
    const STATUS_SIGNED = 'signed';
    const STATUS_ACTIVE = 'active';
    const STATUS_SUPERSEDED = 'superseded';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'contract_id',
        'version',
        'terms_and_conditions',
        'special_provisions',
        'notes',
        'custom_specifications',
        'base_amount',
        'discount_amount',
        'tax_rate',
        'tax_amount',
        'total_amount',
        'status',
        'revision_reason',
        'approved_at',
        'sent_at',
        'signed_at',
        'is_current',
        'created_by',
    ];

    protected $casts = [
        'version' => 'integer',
        'base_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'is_current' => 'boolean',
        'approved_at' => 'datetime',
        'sent_at' => 'datetime',
        'signed_at' => 'datetime',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    /**
     * 親Contract
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * 契約明細
     */
    public function items(): HasMany
    {
        return $this->hasMany(ContractItem::class)->orderBy('sort_order');
    }

    /**
     * 作成者
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // -------------------------
    // スコープ
    // -------------------------

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }
}
