<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use App\Observers\QuoteObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy(QuoteObserver::class)]
class Quote extends Model
{
    use HasUlid, SoftDeletes;

    // ステータス定数
    const STATUS_DRAFT = 'draft';
    const STATUS_NEGOTIATING = 'negotiating';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_CONTRACTED = 'contracted';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'quote_number',
        'user_id',
        'contact_id',
        'company_id',
        'title',
        'requirements',
        'current_version_id',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    /**
     * クライアント（ユーザー）
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * お問い合わせ（Contactから作成された場合）
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * クライアント企業
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

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

    /**
     * 見積もりバージョン一覧
     */
    public function versions(): HasMany
    {
        return $this->hasMany(QuoteVersion::class)->orderBy('version');
    }

    /**
     * 現在採用されているバージョン
     */
    public function currentVersion(): BelongsTo
    {
        return $this->belongsTo(QuoteVersion::class, 'current_version_id');
    }

    // -------------------------
    // スコープ
    // -------------------------

    public function scopeActive($query)
    {
        return $query->where('status', '!=', self::STATUS_CANCELLED);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }
}
