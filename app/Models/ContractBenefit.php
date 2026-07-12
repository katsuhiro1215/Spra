<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 契約特典（期間ごとのチケット付与バッチ）
 *
 * 例: 2026-07分として4枚付与、うち1枚使用、残り3枚
 */
class ContractBenefit extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_id',
        'contract_version_id',
        'benefit_type',
        'unit_minutes',
        'period_label',
        'period_start',
        'period_end',
        'granted_quantity',
        'carried_over_quantity',
        'used_quantity',
        'status',
        'expires_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'expires_at' => 'date',
        'unit_minutes' => 'integer',
        'granted_quantity' => 'integer',
        'carried_over_quantity' => 'integer',
        'used_quantity' => 'integer',
    ];

    public const BENEFIT_TYPES = [
        'meeting' => 'ミーティング',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function contractVersion(): BelongsTo
    {
        return $this->belongsTo(ContractVersion::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(ContractBenefitUsage::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * このバッチの残数（付与＋繰越－消費）
     */
    public function remainingQuantity(): int
    {
        return $this->granted_quantity + $this->carried_over_quantity - $this->used_quantity;
    }
}
