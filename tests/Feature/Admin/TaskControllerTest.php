<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_create_task(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.task.store'), [
                'title' => 'Instagram投稿',
                'due_date' => today()->toDateString(),
                'due_time' => '14:00',
                'priority' => 'high',
                'admin_id' => $admin->id,
            ])
            ->assertRedirect(route('admin.task.index'));

        $this->assertDatabaseHas('tasks', ['title' => 'Instagram投稿', 'priority' => 'high']);
    }

    public function test_updating_status_to_done_sets_completed_at(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'todo']);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'done'])
            ->assertRedirect();

        $this->assertNotNull($task->fresh()->completed_at);
    }

    public function test_editor_cannot_delete_task(): void
    {
        $editor = Admin::factory()->create(['role' => 'editor', 'status' => 'active']);
        $task = Task::factory()->for($editor, 'creator')->create();

        $this->actingAs($editor, 'admins')
            ->delete(route('admin.task.destroy', $task))
            ->assertForbidden();
    }
}
