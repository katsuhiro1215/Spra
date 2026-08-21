<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceItemUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_update_a_service_item_without_changing_the_slug(): void
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
        $item = ServiceItem::create([
            'service_id' => $service->id,
            'name' => 'テスト項目',
            'slug' => 'test-item',
            'item_type' => 'included',
            'standard_price' => 10000,
            'internal_cost' => 5000,
            'status' => 'active',
        ]);

        // スラッグを変更せずに更新すると「既に使用されています」エラーになっていた
        // 不具合の回帰テスト（unique:service_items,slugにignore()が無かった）
        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.service.item.update', $item->id),
            [
                'service_id' => $service->id,
                'name' => 'テスト項目（更新）',
                'slug' => 'test-item',
                'description' => '',
                'item_type' => 'included',
                'standard_price' => 12000,
                'internal_cost' => 6000,
                'estimated_days' => '',
                'estimated_hours' => '',
                'benefit_type' => '',
                'benefit_ticket_count' => '',
                'benefit_unit_minutes' => '',
                'sort_order' => 0,
                'status' => 'active',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $response->assertRedirect(route('admin.service.item.index'));
        $this->assertSame('テスト項目（更新）', $item->fresh()->name);
    }
}
