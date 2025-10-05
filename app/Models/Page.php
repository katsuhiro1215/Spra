<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'template',
        'content',
        'meta',
        'settings',
        'is_published',
        'sort_order'
    ];

    protected $casts = [
        'content' => 'array',
        'meta' => 'array',
        'settings' => 'array',
        'is_published' => 'boolean'
    ];

    // スコープ
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeBySlug($query, $slug)
    {
        return $query->where('slug', $slug);
    }

    // アクセサ
    protected function metaTitle(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->meta['title'] ?? $this->title
        );
    }

    protected function metaDescription(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->meta['description'] ?? ''
        );
    }
}
