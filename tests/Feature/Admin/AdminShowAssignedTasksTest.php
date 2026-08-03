<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminShowAssignedTasksTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_show_page_includes_assigned_tasks(): void
    {
        $viewer = Admin::factory()->create(['role' => 'super_admin', 'status' => 'active']);
        $target = Admin::factory()->create(['status' => 'active']);
        $task = Task::factory()->for($viewer, 'creator')->create([
            'admin_id' => $target->id,
            'status' => 'todo',
        ]);

        $response = $this->actingAs($viewer, 'admins')->get(route('admin.admin.show', $target));

        $response->assertInertia(fn ($page) => $page
            ->has('assignedTasks', 1)
            ->where('assignedTasks.0.id', $task->id));
    }
}
