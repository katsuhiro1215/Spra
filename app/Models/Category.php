<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'sort_order'
    ];

    // リレーションシップ
    public function blogPosts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class);
    }

    // スコープ
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function scopeWithPosts($query)
    {
        return $query->whereHas('blogPosts', function ($query) {
            $query->where('status', 'published');
        });
    }

    // アクセサ
    public function getPostsCountAttribute()
    {
        return $this->blogPosts()->where('status', 'published')->count();
    }
}
