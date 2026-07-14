<?php

namespace Database\Seeders;

use App\Models\ServiceItem;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use Illuminate\Database\Seeder;

class ServicePlanItemSeeder extends Seeder
{
  /**
   * 各ServicePlanに、同じServiceに属するServiceItemを紐付ける。
   * plan_base/includedタイプは必須項目、optional/addonは任意項目として登録する。
   */
  public function run(): void
  {
    ServicePlan::with('service')->get()->each(function (ServicePlan $plan) {
      $items = ServiceItem::where('service_id', $plan->service_id)
        ->orderBy('item_type')
        ->orderBy('sort_order')
        ->get();

      foreach ($items as $index => $item) {
        ServicePlanItem::create([
          'service_plan_id' => $plan->id,
          'service_item_id' => $item->id,
          'quantity' => 1,
          'estimated_days' => $item->estimated_days,
          'is_required' => in_array($item->item_type, ['plan_base', 'included'], true),
          'sort_order' => $index + 1,
        ]);
      }
    });
  }
}
