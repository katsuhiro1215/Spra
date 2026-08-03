<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Task;
use App\Notifications\TaskDueReminder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class TaskReminderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Admin::booted() が保存時にSpatieロールを同期するため、対象ロールを事前にシードしておく
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_send_reminders_command_notifies_admin_for_tasks_due_soon(): void
    {
        Notification::fake();

        $admin = Admin::factory()->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'due_time' => now()->addMinutes(15)->format('H:i'),
            'status' => 'todo',
        ]);

        $this->artisan('tasks:send-reminders')->assertExitCode(0);

        Notification::assertSentTo($admin, TaskDueReminder::class, function ($notification) use ($admin, $task) {
            return $notification->toArray($admin)['task_id'] === $task->id;
        });
    }
}
