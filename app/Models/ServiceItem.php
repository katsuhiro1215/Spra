<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceItem extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'service_id',
        'name',
        'slug',
        'description',
        'item_type',
        'benefit_type',
        'benefit_ticket_count',
        'benefit_unit_minutes',
        'standard_price',
        'internal_cost',
        'estimated_days',
        'estimated_hours',
        'sort_order',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'standard_price' => 'decimal:2',
        'internal_cost' => 'decimal:2',
        'estimated_days' => 'integer',
        'estimated_hours' => 'integer',
        'benefit_ticket_count' => 'integer',
        'benefit_unit_minutes' => 'integer',
        'sort_order' => 'integer',
        'status' => 'string',
        'item_type' => 'string',
    ];

    /**
     * Get the service that owns the service item.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the service plans that include this service item.
     */
    public function servicePlans()
    {
        return $this->belongsToMany(ServicePlan::class, 'service_plan_items')
            ->withPivot('quantity', 'estimated_days', 'sort_order', 'is_required')
            ->orderBy('service_plan_items.sort_order');
    }

    /**
     * Get the service plan items for this service item.
     */
    public function servicePlanItems()
    {
        return $this->hasMany(ServicePlanItem::class);
    }

    /**
     * Get the quote items for this service item.
     */
    public function quoteItems()
    {
        return $this->hasMany(QuoteItem::class);
    }

    /**
     * Get the admin who created this service item.
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Get the admin who last updated this service item.
     */
    public function updater()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // スコープ
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }

    public function scopeByPlan($query, $planId)
    {
        return $query->where('service_plan_id', $planId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('item_type', $type);
    }

    public function scopeAddons($query)
    {
        return $query->whereNull('service_plan_id')->where('item_type', 'addon');
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

    public function isAddon(): bool
    {
        return $this->item_type === 'addon' && is_null($this->service_plan_id);
    }

    public function isPlanBase(): bool
    {
        return $this->item_type === 'plan_base';
    }

    /**
     * この項目が契約特典（チケット）を付与するものかどうか
     */
    public function grantsBenefit(): bool
    {
        return !is_null($this->benefit_type) && $this->benefit_ticket_count > 0;
    }
}
