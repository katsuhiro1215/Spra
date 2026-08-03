<?php

namespace Tests\Unit\Repositories;

use App\Models\Admin;
use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_find_today_for_admin_returns_only_that_admins_undone_tasks_due_today(): void
    {
        $repository = app(TaskRepositoryInterface::class);
        $admin = Admin::factory()->create();
        $otherAdmin = Admin::factory()->create();

        $today = Task::factory()->for($admin, 'admin')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'status' => 'todo',
        ]);
        Task::factory()->create(['admin_id' => $admin->id, 'due_date' => today()->addDay(), 'status' => 'todo']);
        Task::factory()->create(['admin_id' => $otherAdmin->id, 'due_date' => today(), 'status' => 'todo']);
        Task::factory()->create(['admin_id' => $admin->id, 'due_date' => today(), 'status' => 'done']);

        $result = $repository->findTodayForAdmin($admin->id);

        $this->assertCount(1, $result);
        $this->assertSame($today->id, $result->first()->id);
    }

    public function test_find_for_board_filters_by_tag(): void
    {
        $repository = app(TaskRepositoryInterface::class);
        $admin = Admin::factory()->create();

        $matching = Task::factory()->for($admin, 'creator')->create(['tags' => ['SNS', '投稿']]);
        Task::factory()->for($admin, 'creator')->create(['tags' => ['事務']]);

        $result = $repository->findForBoard(['tag' => 'SNS']);

        $this->assertCount(1, $result);
        $this->assertSame($matching->id, $result->first()->id);
    }
}
