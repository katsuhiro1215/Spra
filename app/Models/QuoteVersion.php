<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 見積もりバージョン
 * 
 * Quoteの各バージョンを管理
 * 監査証跡として、すべてのバージョンを保持
 */
class QuoteVersion extends Model
{
    use HasUlid, HasFactory;

    // ステータス定数
    const STATUS_DRAFT = 'draft';
    const STATUS_SENT = 'sent';
    const STATUS_VIEWED = 'viewed';
    const STATUS_REVISION_REQUESTED = 'revision_requested';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'quote_id',
        'version',
        'title',
        'requirements',
        'custom_specifications',
        'base_amount',
        'discount_amount',
        'tax_rate',
        'tax_amount',
        'total_amount',
        'status',
        'client_feedback',
        'revision_reason',
        'sent_at',
        'responded_at',
        'expires_at',
        'is_current',
        'campaign_id',
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
        'sent_at' => 'datetime',
        'responded_at' => 'datetime',
        'expires_at' => 'datetime',
        'custom_specifications' => 'json',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    /**
     * 親Quote
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * 見積明細
     */
    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class)->orderBy('sort_order');
    }

    /**
     * 作成者
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * 適用中のキャンペーン
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
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

    public function scopeSent($query)
    {
        return $query->where('status', '!=', self::STATUS_DRAFT);
    }
}
