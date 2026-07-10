<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ServicePlan と ServiceItem の中間テーブルモデル
 * 
 * ServicePlan に包含される ServiceItem と、その詳細情報を管理
 */
class ServicePlanItem extends Model
{
  use HasUlid;

  protected $table = 'service_plan_items';

  protected $fillable = [
    'service_plan_id',
    'service_item_id',
    'quantity',
    'estimated_days',
    'is_required',
    'sort_order',
  ];

  protected $casts = [
    'quantity' => 'integer',
    'estimated_days' => 'integer',
    'is_required' => 'boolean',
    'sort_order' => 'integer',
  ];

  public $timestamps = true;

    // ========================
    // リレーション
    // ========================

  /**
   * Get the service plan.
   */
  public function servicePlan(): BelongsTo
  {
    return $this->belongsTo(ServicePlan::class);
  }

  /**
   * Get the service item.
   */
  public function serviceItem(): BelongsTo
  {
    return $this->belongsTo(ServiceItem::class);
  }
}
