<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'post_category_id',
        'title',
        'slug',
        'content',
        'thumbnail',
        'excerpt',
        'views',
        'tags',
        'meta',
        'meta_title',
        'meta_description',
        'is_published',
        'published_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'content' => 'array',  // JSON for block editor
        'tags' => 'array',
        'meta' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = [
        'meta_title',
        'meta_description',
    ];

    // メタタイトル（meta JSON内に保持）
    public function getMetaTitleAttribute(): ?string
    {
        return $this->meta['title'] ?? null;
    }

    public function setMetaTitleAttribute(?string $value): void
    {
        $meta = $this->meta ?? [];
        $meta['title'] = $value;
        $this->attributes['meta'] = json_encode($meta);
    }

    // メタディスクリプション（meta JSON内に保持）
    public function getMetaDescriptionAttribute(): ?string
    {
        return $this->meta['description'] ?? null;
    }

    public function setMetaDescriptionAttribute(?string $value): void
    {
        $meta = $this->meta ?? [];
        $meta['description'] = $value;
        $this->attributes['meta'] = json_encode($meta);
    }

    // リレーションシップ
    public function postCategory(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(Admin::class, 'deleted_by');
    }

    // スコープ
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('is_published', false);
    }

    public function scopeRecent($query, $limit = 5)
    {
        return $query->orderBy('published_at', 'desc')->limit($limit);
    }
}
