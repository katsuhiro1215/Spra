<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServicePlan extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'service_id',
        'description',
        'details',
        'base_price',
        'discount_amount',
        'billing_cycle',
        'setup_fee',
        'max_revisions',
        'max_carryover_tickets',
        'estimated_delivery_days',
        'status',
        'is_displayed',
        'is_featured',
        'sort_order',
        'color',
        'badge_text',
        'icon',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'setup_fee' => 'decimal:2',
        'max_revisions' => 'integer',
        'max_carryover_tickets' => 'integer',
        'estimated_delivery_days' => 'integer',
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'is_displayed' => 'boolean',
        'status' => 'string',
    ];

    /**
     * Get the service that owns the service plan.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the service items included in this plan.
     */
    public function serviceItems()
    {
        return $this->belongsToMany(ServiceItem::class, 'service_plan_items')
            ->withPivot('quantity', 'estimated_days', 'sort_order', 'is_required')
            ->orderBy('service_plan_items.sort_order');
    }

    /**
     * Get the service plan items for this plan.
     */
    public function servicePlanItems()
    {
        return $this->hasMany(ServicePlanItem::class);
    }

    /**
     * Get the quotes for this service plan.
     */
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    /**
     * Get the contracts for this service plan.
     */
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Get the campaigns that are restricted to this service plan.
     */
    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'campaign_service_plans');
    }

    /**
     * Get the admin who created this service plan.
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Get the admin who last updated this service plan.
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
     * Scope a query to only include plans displayed on the public website/simulator.
     */
    public function scopeDisplayed($query)
    {
        return $query->where('is_displayed', true);
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
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
     * Check if plan is displayed on the public website/simulator.
     */
    public function isDisplayed(): bool
    {
        return $this->is_displayed;
    }
}
