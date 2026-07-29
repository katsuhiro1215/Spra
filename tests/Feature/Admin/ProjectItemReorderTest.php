<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\ProjectItem;
use App\Models\ProjectVersion;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectItemReorderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_reorder_gantt_items(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $version = ProjectVersion::factory()->create();

        $itemA = ProjectItem::factory()->create(['project_version_id' => $version->id, 'sort_order' => 0]);
        $itemB = ProjectItem::factory()->create(['project_version_id' => $version->id, 'sort_order' => 1]);
        $itemC = ProjectItem::factory()->create(['project_version_id' => $version->id, 'sort_order' => 2]);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.project.versions.items.reorder', [
                'project' => $version->project_id,
                'version' => $version->id,
            ]), [
                'order' => [$itemC->id, $itemA->id, $itemB->id],
            ])
            ->assertRedirect();

        $this->assertSame(0, $itemC->fresh()->sort_order);
        $this->assertSame(1, $itemA->fresh()->sort_order);
        $this->assertSame(2, $itemB->fresh()->sort_order);
    }

    public function test_reorder_does_not_affect_items_from_another_version(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $version = ProjectVersion::factory()->create();
        $otherVersion = ProjectVersion::factory()->create();

        $item = ProjectItem::factory()->create(['project_version_id' => $version->id, 'sort_order' => 0]);
        $otherItem = ProjectItem::factory()->create(['project_version_id' => $otherVersion->id, 'sort_order' => 0]);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.project.versions.items.reorder', [
                'project' => $version->project_id,
                'version' => $version->id,
            ]), [
                'order' => [$otherItem->id, $item->id],
            ]);

        // 他バージョンのアイテムは対象外なので更新されない
        $this->assertSame(0, $otherItem->fresh()->sort_order);
    }
}
