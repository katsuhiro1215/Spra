<?php

namespace Database\Seeders;

use App\Models\ServiceItem;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use Illuminate\Database\Seeder;

class ServicePlanItemSeeder extends Seeder
{
  /**
   * plan_base項目のうち、価格帯ごとに専用スラッグ(-basic-plan/-standard-plan/-premium-plan)を
   * 持つものは、対応するプラン名のプランにのみ紐付ける。
   * （例: slugが「-basic-plan」で終わる項目は「ベーシックプラン」という名前のプランにのみ紐付く）
   */
  private const PLAN_BASE_SLUG_SUFFIXES = [
    'ベーシックプラン' => 'basic-plan',
    'スタンダードプラン' => 'standard-plan',
    'プレミアムプラン' => 'premium-plan',
  ];

  /**
   * 各ServicePlanに、同じServiceに属するServiceItemを紐付ける。
   * plan_base項目は、上記スラッグパターンに該当するものは対応プランのみ、
   * それ以外(パターンに合致しないplan_base/included/optional/addon)はそのサービスの全プランに紐付ける。
   */
  public function run(): void
  {
    ServicePlan::with('service')->get()->each(function (ServicePlan $plan) {
      $items = ServiceItem::where('service_id', $plan->service_id)
        ->orderBy('item_type')
        ->orderBy('sort_order')
        ->get()
        ->filter(fn (ServiceItem $item) => $this->belongsToPlan($item, $plan));

      foreach ($items->values() as $index => $item) {
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

  private function belongsToPlan(ServiceItem $item, ServicePlan $plan): bool
  {
    if ($item->item_type !== 'plan_base') {
      return true;
    }

    foreach (self::PLAN_BASE_SLUG_SUFFIXES as $suffix) {
      if (str_ends_with($item->slug, "-{$suffix}")) {
        // 価格帯別のplan_base項目は、対応するプラン名のプランにのみ紐付ける
        $matchedSuffix = self::PLAN_BASE_SLUG_SUFFIXES[$plan->name] ?? null;

        return $matchedSuffix !== null && str_ends_with($item->slug, "-{$matchedSuffix}");
      }
    }

    // 価格帯別スラッグを持たないplan_base項目は、これまで通り全プラン共通
    return true;
  }
}
