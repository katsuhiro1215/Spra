<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServicePlan;
use App\Models\ServiceItem;
use App\Models\ServicePlanItem;

class ServicePlanItemSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // コーポレートサイト制作のプランとアイテムを紐付け
    $lightPlan = ServicePlan::where('slug', 'corporate-light')->first();
    $standardPlan = ServicePlan::where('slug', 'corporate-standard')->first();
    $premiumPlan = ServicePlan::where('slug', 'corporate-premium')->first();

    // ライトプランのアイテム
    if ($lightPlan) {
      $baseItem = ServiceItem::where('slug', 'corporate-light-base')->first();
      $responsiveItem = ServiceItem::where('slug', 'responsive-design')->first();
      $basicSeoItem = ServiceItem::where('slug', 'basic-seo')->first();
      $additionalPageItem = ServiceItem::where('slug', 'additional-page')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $lightPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 30,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($responsiveItem) {
        ServicePlanItem::create([
          'service_plan_id' => $lightPlan->id,
          'service_item_id' => $responsiveItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($basicSeoItem) {
        ServicePlanItem::create([
          'service_plan_id' => $lightPlan->id,
          'service_item_id' => $basicSeoItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
      if ($additionalPageItem) {
        ServicePlanItem::create([
          'service_plan_id' => $lightPlan->id,
          'service_item_id' => $additionalPageItem->id,
          'quantity' => 1,
          'estimated_days' => 3,
          'is_required' => false,
          'sort_order' => 10,
        ]);
      }
    }

    // スタンダードプランのアイテム
    if ($standardPlan) {
      $baseItem = ServiceItem::where('slug', 'corporate-standard-base')->first();
      $responsiveItem = ServiceItem::where('slug', 'responsive-design')->first();
      $detailedSeoItem = ServiceItem::where('slug', 'detailed-seo')->first();
      $blogItem = ServiceItem::where('slug', 'blog-feature')->first();
      $additionalPageItem = ServiceItem::where('slug', 'additional-page')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 45,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($responsiveItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardPlan->id,
          'service_item_id' => $responsiveItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($detailedSeoItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardPlan->id,
          'service_item_id' => $detailedSeoItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
      if ($blogItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardPlan->id,
          'service_item_id' => $blogItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 4,
        ]);
      }
      if ($additionalPageItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardPlan->id,
          'service_item_id' => $additionalPageItem->id,
          'quantity' => 1,
          'estimated_days' => 3,
          'is_required' => false,
          'sort_order' => 10,
        ]);
      }
    }

    // プレミアムプランのアイテム
    if ($premiumPlan) {
      $baseItem = ServiceItem::where('slug', 'corporate-premium-base')->first();
      $advancedDesignItem = ServiceItem::where('slug', 'advanced-design')->first();
      $multilingualItem = ServiceItem::where('slug', 'multilingual-support')->first();
      $cmsItem = ServiceItem::where('slug', 'cms-setup')->first();
      $additionalLanguageItem = ServiceItem::where('slug', 'additional-language')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $premiumPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 60,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($advancedDesignItem) {
        ServicePlanItem::create([
          'service_plan_id' => $premiumPlan->id,
          'service_item_id' => $advancedDesignItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($multilingualItem) {
        ServicePlanItem::create([
          'service_plan_id' => $premiumPlan->id,
          'service_item_id' => $multilingualItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
      if ($cmsItem) {
        ServicePlanItem::create([
          'service_plan_id' => $premiumPlan->id,
          'service_item_id' => $cmsItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 4,
        ]);
      }
      if ($additionalLanguageItem) {
        ServicePlanItem::create([
          'service_plan_id' => $premiumPlan->id,
          'service_item_id' => $additionalLanguageItem->id,
          'quantity' => 1,
          'estimated_days' => 7,
          'is_required' => false,
          'sort_order' => 10,
        ]);
      }
    }

    // ECサイト構築のプランとアイテムを紐付け
    $smallPlan = ServicePlan::where('slug', 'ec-small')->first();
    $businessPlan = ServicePlan::where('slug', 'ec-business')->first();
    $enterprisePlan = ServicePlan::where('slug', 'ec-enterprise')->first();

    if ($smallPlan) {
      $baseItem = ServiceItem::where('slug', 'ec-small-base')->first();
      $inventoryItem = ServiceItem::where('slug', 'inventory-management')->first();
      $paymentItem = ServiceItem::where('slug', 'payment-integration')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $smallPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 45,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($inventoryItem) {
        ServicePlanItem::create([
          'service_plan_id' => $smallPlan->id,
          'service_item_id' => $inventoryItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($paymentItem) {
        ServicePlanItem::create([
          'service_plan_id' => $smallPlan->id,
          'service_item_id' => $paymentItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
    }

    if ($businessPlan) {
      $baseItem = ServiceItem::where('slug', 'ec-business-base')->first();
      $inventoryItem = ServiceItem::where('slug', 'inventory-management')->first();
      $paymentItem = ServiceItem::where('slug', 'payment-integration')->first();
      $marketingItem = ServiceItem::where('slug', 'marketing-tools')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $businessPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 60,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($inventoryItem) {
        ServicePlanItem::create([
          'service_plan_id' => $businessPlan->id,
          'service_item_id' => $inventoryItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($paymentItem) {
        ServicePlanItem::create([
          'service_plan_id' => $businessPlan->id,
          'service_item_id' => $paymentItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
      if ($marketingItem) {
        ServicePlanItem::create([
          'service_plan_id' => $businessPlan->id,
          'service_item_id' => $marketingItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 4,
        ]);
      }
    }

    if ($enterprisePlan) {
      $baseItem = ServiceItem::where('slug', 'ec-enterprise-base')->first();
      $inventoryItem = ServiceItem::where('slug', 'inventory-management')->first();
      $paymentItem = ServiceItem::where('slug', 'payment-integration')->first();
      $marketingItem = ServiceItem::where('slug', 'marketing-tools')->first();
      $apiItem = ServiceItem::where('slug', 'api-integration')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $enterprisePlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 90,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($inventoryItem) {
        ServicePlanItem::create([
          'service_plan_id' => $enterprisePlan->id,
          'service_item_id' => $inventoryItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($paymentItem) {
        ServicePlanItem::create([
          'service_plan_id' => $enterprisePlan->id,
          'service_item_id' => $paymentItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
      if ($marketingItem) {
        ServicePlanItem::create([
          'service_plan_id' => $enterprisePlan->id,
          'service_item_id' => $marketingItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 4,
        ]);
      }
      if ($apiItem) {
        ServicePlanItem::create([
          'service_plan_id' => $enterprisePlan->id,
          'service_item_id' => $apiItem->id,
          'quantity' => 1,
          'estimated_days' => 14,
          'is_required' => false,
          'sort_order' => 10,
        ]);
      }
    }

    // ランディングページのプランとアイテムを紐付け
    $simpleLpPlan = ServicePlan::where('slug', 'lp-simple')->first();
    $standardLpPlan = ServicePlan::where('slug', 'lp-standard')->first();

    if ($simpleLpPlan) {
      $baseItem = ServiceItem::where('slug', 'lp-simple-base')->first();
      $heroItem = ServiceItem::where('slug', 'hero-image')->first();
      $cvItem = ServiceItem::where('slug', 'cv-optimization')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $simpleLpPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 14,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($heroItem) {
        ServicePlanItem::create([
          'service_plan_id' => $simpleLpPlan->id,
          'service_item_id' => $heroItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($cvItem) {
        ServicePlanItem::create([
          'service_plan_id' => $simpleLpPlan->id,
          'service_item_id' => $cvItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
    }

    if ($standardLpPlan) {
      $baseItem = ServiceItem::where('slug', 'lp-standard-base')->first();
      $heroItem = ServiceItem::where('slug', 'hero-image')->first();
      $cvItem = ServiceItem::where('slug', 'cv-optimization')->first();
      $abItem = ServiceItem::where('slug', 'ab-testing')->first();

      if ($baseItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardLpPlan->id,
          'service_item_id' => $baseItem->id,
          'quantity' => 1,
          'estimated_days' => 21,
          'is_required' => true,
          'sort_order' => 1,
        ]);
      }
      if ($heroItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardLpPlan->id,
          'service_item_id' => $heroItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 2,
        ]);
      }
      if ($cvItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardLpPlan->id,
          'service_item_id' => $cvItem->id,
          'quantity' => 1,
          'estimated_days' => null,
          'is_required' => true,
          'sort_order' => 3,
        ]);
      }
      if ($abItem) {
        ServicePlanItem::create([
          'service_plan_id' => $standardLpPlan->id,
          'service_item_id' => $abItem->id,
          'quantity' => 1,
          'estimated_days' => 5,
          'is_required' => false,
          'sort_order' => 10,
        ]);
      }
    }
  }
}
