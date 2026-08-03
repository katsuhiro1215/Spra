<?php

namespace Tests\Unit\Models;

use App\Models\Admin;
use App\Models\Task;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_is_done_reflects_status(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'todo']);

        $this->assertFalse($task->isDone());

        $task->status = 'done';
        $this->assertTrue($task->isDone());
    }

    public function test_uses_ulid_as_primary_key(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create();

        $this->assertSame(26, strlen($task->id));
        $this->assertFalse($task->incrementing);
    }
}
