<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceItemIndexFilterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_service_plan_filter_narrows_down_the_list(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $category = ServiceCategory::create([
            'name' => 'テストカテゴリ',
            'slug' => 'test-category',
            'status' => 'active',
        ]);
        $service = Service::create([
            'name' => 'テストサービス',
            'slug' => 'test-service',
            'service_category_id' => $category->id,
            'description' => 'テスト',
            'status' => 'active',
        ]);
        $plan = ServicePlan::create([
            'name' => 'テストプラン',
            'slug' => 'test-plan',
            'service_id' => $service->id,
            'base_price' => 100000,
            'billing_cycle' => 'one_time',
            'status' => 'active',
        ]);

        $itemInPlan = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'プラン内項目',
            'slug' => 'in-plan-item',
            'item_type' => 'plan_base',
            'standard_price' => 10000,
            'internal_cost' => 5000,
            'status' => 'active',
        ]);
        ServicePlanItem::create([
            'service_plan_id' => $plan->id,
            'service_item_id' => $itemInPlan->id,
            'quantity' => 1,
            'sort_order' => 0,
        ]);

        ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'プラン外項目',
            'slug' => 'not-in-plan-item',
            'item_type' => 'addon',
            'standard_price' => 5000,
            'internal_cost' => 2000,
            'status' => 'active',
        ]);

        // service_plan_idフィルターがバックエンドで一切適用されておらず、
        // 常に全件返っていた不具合の回帰テスト
        $response = $this->actingAs($admin, 'admins')->get(
            route('admin.service.item.index', ['service_plan_id' => $plan->id]),
        );

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/ServiceItems/Index')
            ->has('serviceItems.data', 1)
            ->where('serviceItems.data.0.id', $itemInPlan->id)
        );
    }
}
