<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use App\Models\Admin;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'gallery',
        'status',
        'post_type',
        'meta',
        'custom_fields',
        'published_at',
        'author_id'
    ];

    protected $casts = [
        'gallery' => 'array',
        'meta' => 'array',
        'custom_fields' => 'array',
        'published_at' => 'datetime'
    ];

    // リレーションシップ
    public function author(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'author_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    // スコープ
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('post_type', $type);
    }

    public function scopeRecent($query, $limit = 5)
    {
        return $query->orderBy('published_at', 'desc')->limit($limit);
    }

    // アクセサ
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ?: Str::limit(strip_tags($this->content), 150)
        );
    }

    protected function readingTime(): Attribute
    {
        return Attribute::make(
            get: fn () => ceil(str_word_count(strip_tags($this->content)) / 200)
        );
    }
}
