<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PointRedemption extends Model
{
    use HasUlid;

    public const STATUSES = [
        'pending' => '申請中',
        'approved' => '承認済み',
        'rejected' => '却下',
    ];

    protected $fillable = [
        'company_id',
        'point_catalog_item_id',
        'item_name',
        'points_used',
        'status',
        'requested_by',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'points_used' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = [
        'status_label',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(PointCatalogItem::class, 'point_catalog_item_id');
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'reviewed_by');
    }

    public function transaction(): HasOne
    {
        return $this->hasOne(PointTransaction::class, 'redemption_id');
    }

    // -------------------------
    // ヘルパー
    // -------------------------

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => self::STATUSES[$this->status] ?? $this->status
        );
    }
}
