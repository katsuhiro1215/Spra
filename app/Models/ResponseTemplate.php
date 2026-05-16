<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResponseTemplate extends Model
{
    use HasUlid, SoftDeletes;

    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';

    protected $fillable = [
        'name',
        'category',
        'subject',
        'body',
        'placeholders',
        'status',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    // -------------------------
    // リレーション
    // -------------------------

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // -------------------------
    // ヘルパーメソッド
    // -------------------------

    /**
     * 有効かどうか
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * 無効かどうか
     */
    public function isInactive(): bool
    {
        return $this->status === self::STATUS_INACTIVE;
    }

    /**
     * 使用可能なプレースホルダー一覧を取得
     */
    public static function getAvailablePlaceholders(): array
    {
        return [
            '{contact_name}' => 'お問い合わせ者名',
            '{contact_email}' => 'お問い合わせ者メールアドレス',
            '{contact_company}' => 'お問い合わせ者会社名',
            '{contact_phone}' => 'お問い合わせ者電話番号',
            '{contact_subject}' => 'お問い合わせ件名',
            '{contact_message}' => 'お問い合わせ内容',
            '{admin_name}' => '担当者名',
            '{today}' => '今日の日付',
            '{app_name}' => 'アプリケーション名',
        ];
    }

    /**
     * スコープ: 有効のみ
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * スコープ: カテゴリでフィルター
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * スコープ: ソート順でソート
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }
}
