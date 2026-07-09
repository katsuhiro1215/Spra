<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 契約書テンプレート
 * 
 * 契約書作成時に使用するテンプレート
 */
class ContractTemplate extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'template_type',
        'terms_and_conditions',
        'special_provisions',
        'status',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    // テンプレートタイプ
    const TYPES = [
        'standard' => '標準契約',
        'monthly' => '月額契約',
        'annual' => '年額契約',
        'custom' => 'カスタム',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    /**
     * 作成者（管理者）
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * 更新者（管理者）
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // -------------------------
    // スコープ
    // -------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
