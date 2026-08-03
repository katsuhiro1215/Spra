<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_update_status_to_done_sets_completed_at(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'todo']);

        $service = app(TaskService::class);
        $updated = $service->updateStatus($task, 'done');

        $this->assertSame('done', $updated->status);
        $this->assertNotNull($updated->completed_at);
    }

    public function test_update_status_away_from_done_clears_completed_at(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        $service = app(TaskService::class);
        $updated = $service->updateStatus($task, 'in_progress');

        $this->assertSame('in_progress', $updated->status);
        $this->assertNull($updated->completed_at);
    }

    public function test_create_task_with_recurrence_rule_due_today_immediately_generates_todays_occurrence(): void
    {
        $admin = Admin::factory()->create();

        $service = app(TaskService::class);
        $template = $service->createTask([
            'title' => '毎日SNS投稿',
            'due_date' => today()->format('Y-m-d'),
            'admin_id' => $admin->id,
            'recurrence_rule' => ['freq' => 'daily'],
        ], $admin->id);

        $this->assertSame(1, Task::where('parent_task_id', $template->id)->count());

        $child = Task::where('parent_task_id', $template->id)->first();
        $this->assertSame(today()->format('Y-m-d'), $child->due_date->format('Y-m-d'));
    }

    public function test_create_task_without_recurrence_rule_does_not_generate_occurrences(): void
    {
        $admin = Admin::factory()->create();

        $service = app(TaskService::class);
        $task = $service->createTask([
            'title' => '単発タスク',
            'due_date' => today()->format('Y-m-d'),
            'admin_id' => $admin->id,
        ], $admin->id);

        $this->assertSame(0, Task::where('parent_task_id', $task->id)->count());
    }
}
