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
    'service_plan_id',
    'item_type',
    'name',
    'description',
    'price',
    'estimated_days',
    'is_required',
    'sort_order',
    'status',
    'created_by',
    'updated_by',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'estimated_days' => 'integer',
    'is_required' => 'boolean',
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
   * Get the service plan that owns the service item.
   */
  public function servicePlan()
  {
    return $this->belongsTo(ServicePlan::class);
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
}
