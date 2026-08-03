<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRecurrenceGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_daily_occurrences_up_to_horizon_without_duplicates(): void
    {
        $admin = Admin::factory()->create();
        $template = Task::factory()->for($admin, 'creator')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'recurrence_rule' => ['freq' => 'daily'],
            'parent_task_id' => null,
        ]);

        $service = app(TaskService::class);
        $created = $service->generateUpcomingOccurrences(horizonDays: 3);

        $this->assertSame(3, $created);
        $this->assertSame(3, Task::where('parent_task_id', $template->id)->count());

        $createdAgain = $service->generateUpcomingOccurrences(horizonDays: 3);
        $this->assertSame(0, $createdAgain);
    }
}
