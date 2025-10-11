<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'service_category_id',
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
        'is_featured',
        'is_active'
    ];

    protected $casts = [
        'features' => 'array',
        'pricing' => 'array',
        'demo_links' => 'array',
        'gallery' => 'array',
        'technologies' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean'
    ];

    /**
     * Get the service category that owns the service.
     */
    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategory::class);
    }

    // スコープ
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('service_category_id', $categoryId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // アクセサ
    protected function categoryName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->serviceCategory?->name ?? '未分類'
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

    /**
     * Automatically generate slug from name.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->name);
            }
        });

        static::updating(function ($service) {
            if ($service->isDirty('name') && empty($service->slug)) {
                $service->slug = Str::slug($service->name);
            }
        });
    }
}
