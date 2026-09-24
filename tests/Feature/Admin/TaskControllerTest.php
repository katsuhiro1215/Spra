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

    public function test_updating_status_to_review_does_not_set_completed_at(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'in_progress']);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'review'])
            ->assertRedirect();

        $task->refresh();
        $this->assertSame('review', $task->status);
        $this->assertNull($task->completed_at);
    }

    public function test_index_exposes_assignee_role_including_ai_staff(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        Admin::factory()->aiStaff('marketing')->create(['status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.task.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Tasks/Index')
            ->has('admins', 2)
            ->where('admins.0.role', fn ($role) => in_array($role, ['admin', 'ai_staff'], true))
            ->where('admins.1.role', fn ($role) => in_array($role, ['admin', 'ai_staff'], true))
        );
    }

    public function test_creating_weekly_recurring_task_without_weekday_fails_validation(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.task.store'), [
                'title' => '週次投稿',
                'due_date' => today()->toDateString(),
                'priority' => 'medium',
                'recurrence_rule' => ['freq' => 'weekly', 'byweekday' => []],
            ])
            ->assertSessionHasErrors('recurrence_rule.byweekday');

        $this->assertDatabaseMissing('tasks', ['title' => '週次投稿']);
    }

    public function test_editor_cannot_delete_task(): void
    {
        $editor = Admin::factory()->create(['role' => 'editor', 'status' => 'active']);
        $task = Task::factory()->for($editor, 'creator')->create();

        $this->actingAs($editor, 'admins')
            ->delete(route('admin.task.destroy', $task))
            ->assertForbidden();
    }

    public function test_updating_status_of_an_ai_staff_task_logs_the_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($aiStaff, 'admin')->create([
            'title' => 'SNS投稿作成',
            'status' => 'in_progress',
        ]);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'review'])
            ->assertRedirect();

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => \App\Models\AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'subject_type' => Task::class,
            'subject_id' => $task->id,
        ]);
    }

    public function test_updating_status_of_a_human_admins_task_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($admin, 'admin')->create(['status' => 'in_progress']);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'review'])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }

    public function test_resubmitting_the_same_status_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($aiStaff, 'admin')->create([
            'status' => 'in_progress',
        ]);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'in_progress'])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }

    public function test_updating_status_via_edit_form_of_an_ai_staff_task_logs_the_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($aiStaff, 'admin')->create([
            'title' => 'SNS投稿作成',
            'status' => 'in_progress',
            'due_date' => today(),
        ]);

        $this->actingAs($admin, 'admins')
            ->put(route('admin.task.update', $task), [
                'title' => $task->title,
                'due_date' => $task->due_date->toDateString(),
                'priority' => $task->priority,
                'status' => 'review',
                'admin_id' => $aiStaff->id,
            ])
            ->assertRedirect(route('admin.task.index'));

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => \App\Models\AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'subject_type' => Task::class,
            'subject_id' => $task->id,
        ]);
    }

    public function test_updating_other_fields_via_edit_form_without_status_change_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($aiStaff, 'admin')->create([
            'title' => 'SNS投稿作成',
            'status' => 'in_progress',
            'due_date' => today(),
        ]);

        $this->actingAs($admin, 'admins')
            ->put(route('admin.task.update', $task), [
                'title' => '更新後タイトル',
                'due_date' => $task->due_date->toDateString(),
                'priority' => $task->priority,
                'status' => 'in_progress',
                'admin_id' => $aiStaff->id,
            ])
            ->assertRedirect(route('admin.task.index'));

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
