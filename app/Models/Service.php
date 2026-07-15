<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'service_category_id',
        'media_id',
        'description',
        'details',
        'icon',
        'status',
        'is_displayed',
        'sort_order',
        'is_featured',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_displayed' => 'boolean',
        'status' => 'string',
    ];

    /**
     * Get the service category that owns the service.
     */
    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategory::class);
    }

    /**
     * Get the service plans for this service.
     */
    public function servicePlans()
    {
        return $this->hasMany(ServicePlan::class);
    }

    /**
     * Get the service items for this service.
     */
    public function serviceItems()
    {
        return $this->hasMany(ServiceItem::class);
    }

    /**
     * Get the gallery media (images) for this service.
     */
    public function media()
    {
        return $this->belongsToMany(Media::class, 'service_media')
            ->withPivot('sort_order', 'is_primary')
            ->orderBy('service_media.sort_order');
    }

    /**
     * Get the thumbnail/cover image for this service (admin display).
     */
    public function thumbnail()
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * Get the technologies used for this service.
     */
    public function technologies()
    {
        return $this->belongsToMany(Technology::class, 'service_technology')
            ->withPivot('sort_order')
            ->orderBy('service_technology.sort_order');
    }

    /**
     * Get the past-work portfolio pieces for this service.
     */
    public function portfolios()
    {
        return $this->belongsToMany(Portfolio::class, 'portfolio_service')
            ->withPivot('sort_order')
            ->orderBy('portfolio_service.sort_order');
    }

    /**
     * Get the quotes for this service.
     */
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    /**
     * Get the contracts for this service.
     */
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Get the admin who created this service.
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Get the admin who last updated this service.
     */
    public function updater()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // スコープ
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include services displayed on the public website/simulator.
     */
    public function scopeDisplayed($query)
    {
        return $query->where('is_displayed', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('service_category_id', $categoryId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // ヘルパーメソッド
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if service is displayed on the public website/simulator.
     */
    public function isDisplayed(): bool
    {
        return $this->is_displayed;
    }

    // アクセサ
    protected function categoryName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->serviceCategory?->name ?? '未分類'
        );
    }
}
