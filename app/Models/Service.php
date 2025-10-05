<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'details',
        'icon',
        'features',
        'pricing',
        'demo_links',
        'gallery',
        'technologies',
        'status',
        'sort_order',
        'is_featured'
    ];

    protected $casts = [
        'features' => 'array',
        'pricing' => 'array',
        'demo_links' => 'array',
        'gallery' => 'array',
        'technologies' => 'array',
        'is_featured' => 'boolean'
    ];

    // スコープ
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // アクセサ
    protected function categoryName(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->category) {
                'web' => 'Web開発',
                'system' => 'システム開発',
                'app' => 'アプリ開発',
                'consulting' => 'コンサルティング',
                default => $this->category
            }
        );
    }

    protected function hasDemo(): Attribute
    {
        return Attribute::make(
            get: fn() => !empty($this->demo_links)
        );
    }

    protected function techStack(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->technologies ?: []
        );
    }

    protected function startingPrice(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->pricing)) {
                    return null;
                }
                $prices = collect($this->pricing)->pluck('price')->filter();
                return $prices->min();
            }
        );
    }
}
