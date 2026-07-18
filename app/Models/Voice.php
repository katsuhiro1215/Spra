<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Voice extends Model
{
    /** @use HasFactory<\Database\Factories\VoiceFactory> */
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'service_id',
        'avatar_id',
        'author_name',
        'author_title',
        'company_name',
        'rating',
        'content',
        'is_featured',
        'is_published',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected $appends = [
        'display_name',
        'avatar_url',
    ];

    /**
     * 声を寄せたクライアント（登録アカウント）
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 対象サービス
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * 表示用アバター画像
     */
    public function avatar()
    {
        return $this->belongsTo(Media::class, 'avatar_id');
    }

    /**
     * 作成した管理者
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * 更新した管理者
     */
    public function updater()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }

    /**
     * 表示名（未紐付けの場合は登録クライアントのプロフィール名にフォールバック）
     */
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->author_name ?: ($this->user?->profile?->full_name ?? '匿名希望')
        );
    }

    /**
     * アバターURL（未設定の場合は登録クライアントのプロフィール画像にフォールバック）
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar?->url ?? $this->user?->profile?->avatar_url
        );
    }
}
