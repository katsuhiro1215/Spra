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
        'media_id',
        'name',
        'slug',
        'service_category_id',
        'description',
        'details',
        'icon',
        'status',
        'sort_order',
        'is_featured',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
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
     * Get the media (image) for this service.
     */
    public function media()
    {
        return $this->belongsTo(Media::class);
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

    // アクセサ
    protected function categoryName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->serviceCategory?->name ?? '未分類'
        );
    }
}
