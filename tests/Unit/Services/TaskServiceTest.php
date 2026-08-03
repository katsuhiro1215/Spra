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
}
