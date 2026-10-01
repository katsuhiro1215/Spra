<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRecurringAndArchiveControllerTest extends TestCase
{
    use RefreshDatabase;

    private Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        Carbon::setTestNow('2026-10-05 09:00:00');
        $this->admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    // 停止(destroy)は初期ルールでadminロールに付与されない（タスク削除と同じ扱い）ため、ownerで検証する
    private function owner(): Admin
    {
        return Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
    }

    private function makeTemplate(): Task
    {
        return Task::factory()->for($this->admin, 'creator')->create([
            'title' => 'X投稿',
            'due_date' => today(),
            'due_time' => '07:30',
            'recurrence_rule' => ['freq' => 'daily'],
            'parent_task_id' => null,
        ]);
    }

    private function makeDone(string $completedAt, array $attributes = []): Task
    {
        return Task::factory()->for($this->admin, 'creator')->create(array_merge([
            'status' => 'done',
            'completed_at' => $completedAt,
            'recurrence_rule' => null,
            'parent_task_id' => null,
        ], $attributes));
    }

    public function test_recurring_index_lists_templates(): void
    {
        $this->makeTemplate();

        $this->actingAs($this->admin, 'admins')
            ->get(route('admin.recurring-task.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Tasks/Recurring/Index')
                ->has('templates', 1)
                ->where('templates.0.title', 'X投稿'));
    }

    public function test_recurring_update_changes_time_and_future_occurrences(): void
    {
        $template = $this->makeTemplate();
        $future = Task::factory()->for($this->admin, 'creator')->create([
            'title' => 'X投稿', 'due_date' => '2026-10-06', 'due_time' => '07:30',
            'parent_task_id' => $template->id, 'recurrence_rule' => null, 'status' => 'todo',
        ]);

        $this->actingAs($this->admin, 'admins')
            ->put(route('admin.recurring-task.update', $template), [
                'title' => 'X投稿',
                'priority' => 'medium',
                'due_time' => '09:00',
                'recurrence_rule' => ['freq' => 'daily'],
            ])
            ->assertRedirect(route('admin.recurring-task.index'));

        $this->assertSame('09:00', substr($template->fresh()->due_time, 0, 5));
        $this->assertSame('09:00', substr($future->fresh()->due_time, 0, 5));
    }

    public function test_recurring_update_requires_weekday_for_weekly(): void
    {
        $template = $this->makeTemplate();

        $this->actingAs($this->admin, 'admins')
            ->put(route('admin.recurring-task.update', $template), [
                'title' => 'X投稿',
                'priority' => 'medium',
                'recurrence_rule' => ['freq' => 'weekly'],
            ])
            ->assertSessionHasErrors('recurrence_rule.byweekday');
    }

    public function test_recurring_destroy_stops_template(): void
    {
        $template = $this->makeTemplate();

        $this->actingAs($this->owner(), 'admins')
            ->delete(route('admin.recurring-task.destroy', $template))
            ->assertRedirect(route('admin.recurring-task.index'));

        $this->assertSoftDeleted($template);
    }

    public function test_recurring_routes_reject_non_template_tasks(): void
    {
        $task = Task::factory()->for($this->admin, 'creator')->create(['recurrence_rule' => null]);

        $this->actingAs($this->owner(), 'admins')
            ->delete(route('admin.recurring-task.destroy', $task))
            ->assertNotFound();
    }

    public function test_board_shows_only_recently_completed_tasks_and_monthly_counts(): void
    {
        $this->makeDone('2026-10-03 10:00:00', ['title' => '最近の完了']);
        $this->makeDone('2026-09-10 10:00:00', ['title' => '9月の完了']);
        $this->makeDone('2026-08-10 10:00:00', ['title' => '8月の完了']);
        $this->makeDone('2026-08-20 10:00:00', ['title' => '8月の完了2']);

        $this->actingAs($this->admin, 'admins')
            ->get(route('admin.task.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('tasks', 1)
                ->where('tasks.0.title', '最近の完了')
                ->where('completedMonths', [
                    ['month' => '2026-10', 'count' => 1],
                    ['month' => '2026-09', 'count' => 1],
                    ['month' => '2026-08', 'count' => 2],
                ]));
    }

    public function test_completed_archive_lists_tasks_in_month_with_keyword(): void
    {
        $this->makeDone('2026-08-10 10:00:00', ['title' => 'X投稿']);
        $this->makeDone('2026-08-20 10:00:00', ['title' => 'Threads投稿']);
        $this->makeDone('2026-09-01 10:00:00', ['title' => 'X投稿']);

        $this->actingAs($this->admin, 'admins')
            ->get(route('admin.completed-task.index', ['month' => '2026-08', 'keyword' => 'X']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Tasks/Completed/Index')
                ->where('month', '2026-08')
                ->has('tasks.data', 1)
                ->where('tasks.data.0.title', 'X投稿'));
    }

    public function test_bulk_status_marks_selected_tasks_done(): void
    {
        $a = Task::factory()->for($this->admin, 'creator')->create(['status' => 'in_progress', 'recurrence_rule' => null]);
        $b = Task::factory()->for($this->admin, 'creator')->create(['status' => 'in_progress', 'recurrence_rule' => null]);
        $untouched = Task::factory()->for($this->admin, 'creator')->create(['status' => 'in_progress', 'recurrence_rule' => null]);

        $this->actingAs($this->admin, 'admins')
            ->patch(route('admin.task.bulk-status'), ['task_ids' => [$a->id, $b->id], 'status' => 'done'])
            ->assertRedirect();

        $this->assertSame('done', $a->fresh()->status);
        $this->assertNotNull($b->fresh()->completed_at);
        $this->assertSame('in_progress', $untouched->fresh()->status);
    }
}
