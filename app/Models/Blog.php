<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use App\Models\Admin;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_media_id',
        'status',
        'post_type',
        'meta',
        'custom_fields',
        'published_at',
        'author_id'
    ];

    protected $casts = [
        'meta' => 'array',
        'custom_fields' => 'array',
        'published_at' => 'datetime'
    ];

    // リレーションシップ
    public function author(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'author_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(BlogCategory::class);
    }

    public function featuredMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'blog_media')
            ->withPivot(['sort_order', 'usage'])
            ->withTimestamps()
            ->orderBy('pivot_sort_order');
    }

    public function galleryMedia(): BelongsToMany
    {
        return $this->media()->wherePivot('usage', 'gallery');
    }

    public function contentMedia(): BelongsToMany
    {
        return $this->media()->wherePivot('usage', 'content');
    }

    // スコープ
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('post_type', $type);
    }

    public function scopeRecent($query, $limit = 5)
    {
        return $query->orderBy('published_at', 'desc')->limit($limit);
    }

    public function scopeWithCategories($query, $categoryIds)
    {
        return $query->whereHas('categories', function ($q) use ($categoryIds) {
            $q->whereIn('blog_category_id', (array) $categoryIds);
        });
    }

    // アクセサ
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ?: Str::limit(strip_tags($this->content), 150)
        );
    }

    protected function readingTime(): Attribute
    {
        return Attribute::make(
            get: fn() => ceil(str_word_count(strip_tags($this->content)) / 200)
        );
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->status) {
                'draft' => '下書き',
                'published' => '公開済み',
                'archived' => 'アーカイブ',
                default => $this->status
            }
        );
    }

    protected function postTypeLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->post_type) {
                'blog' => 'ブログ',
                'case_study' => '事例紹介',
                'news' => 'ニュース',
                default => $this->post_type
            }
        );
    }

    protected function featuredImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->featuredMedia?->full_url
        );
    }

    // ヘルパーメソッド
    public function isPublished(): bool
    {
        return $this->status === 'published'
            && $this->published_at
            && $this->published_at <= now();
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function generateSlug()
    {
        $baseSlug = Str::slug($this->title);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = $blog->generateSlug();
            }
        });

        static::updating(function ($blog) {
            if ($blog->isDirty('title') && empty($blog->slug)) {
                $blog->slug = $blog->generateSlug();
            }
        });
    }
}
