<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ServiceType extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceTypeFactory> */
    use HasFactory;

    protected $fillable = [
        'service_category_id',
        'name',
        'product_name',
        'version',
        'parent_service_id',
        'slug',
        'description',
        'detailed_description',
        'pricing_model',
        'features',
        'target_audience',
        'deliverables',
        'technologies',
        'icon',
        'color',
        'estimated_delivery_days',
        'base_price',
        'price_unit',
        'sort_order',
        'is_active',
        'is_featured',
        'requires_consultation',
        'consultation_note',
        'created_by',
        'updated_by',
        'published_at',
    ];

    protected $casts = [
        'features' => 'array',
        'target_audience' => 'array',
        'deliverables' => 'array',
        'technologies' => 'array',
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'requires_consultation' => 'boolean',
        'published_at' => 'datetime',
    ];

    // リレーションシップ
    public function serviceCategory(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class);
    }

    public function servicePlans(): HasMany
    {
        return $this->hasMany(ServicePlan::class)->orderBy('sort_order');
    }

    public function parentService(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class, 'parent_service_id');
    }

    public function childServices(): HasMany
    {
        return $this->hasMany(ServiceType::class, 'parent_service_id');
    }

    public function priceItems(): HasMany
    {
        return $this->hasMany(ServiceTypePriceItem::class)->orderBy('sort_order');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // スコープ
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('service_category_id', $categoryId);
    }

    public function scopeByPricingModel($query, $model)
    {
        return $query->where('pricing_model', $model);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeByProductName($query, $productName)
    {
        return $query->where('product_name', $productName);
    }

    public function scopeParentServices($query)
    {
        return $query->whereNull('parent_service_id');
    }

    public function scopeWithVersions($query)
    {
        return $query->with('childServices');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%')
                ->orWhere('detailed_description', 'like', '%' . $search . '%')
                ->orWhere('product_name', 'like', '%' . $search . '%');
        });
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

    // アクセサ
    protected function pricingModelLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->pricing_model) {
                'fixed' => '固定価格',
                'subscription' => 'サブスクリプション',
                'custom' => 'カスタム価格',
                'hybrid' => 'ハイブリッド',
                default => $this->pricing_model
            }
        );
    }

    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->base_price
                ? '¥' . number_format($this->base_price) . ($this->price_unit ? '/' . $this->price_unit : '')
                : '要相談'
        );
    }

    protected function estimatedDeliveryLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->estimated_delivery_days
                ? $this->estimated_delivery_days . '日'
                : '要相談'
        );
    }

    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->product_name
                ? $this->product_name . ($this->version ? ' ' . $this->version : '')
                : $this->name
        );
    }

    protected function fullDisplayName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->product_name
                ? $this->product_name . ($this->version ? ' ' . $this->version : '') . ' - ' . $this->name
                : $this->name
        );
    }

    // ヘルパーメソッド
    public function isPublished(): bool
    {
        return $this->published_at && $this->published_at <= now();
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function generateSlug(): string
    {
        $baseSlug = Str::slug($this->name);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    // イベント
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($serviceType) {
            if (empty($serviceType->slug)) {
                $serviceType->slug = $serviceType->generateSlug();
            }

            if (Auth::guard('admins')->check()) {
                $serviceType->created_by = Auth::guard('admins')->id();
            }
        });

        static::updating(function ($serviceType) {
            if ($serviceType->isDirty('name') && empty($serviceType->slug)) {
                $serviceType->slug = $serviceType->generateSlug();
            }

            if (Auth::guard('admins')->check()) {
                $serviceType->updated_by = Auth::guard('admins')->id();
            }
        });
    }
}
