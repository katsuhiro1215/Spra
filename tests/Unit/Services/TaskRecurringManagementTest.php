<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskService;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRecurringManagementTest extends TestCase
{
    use RefreshDatabase;

    private Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        // 2026-10-05は月曜日。曜日判定を決定的にするため固定する
        Carbon::setTestNow('2026-10-05 09:00:00');
        $this->admin = Admin::factory()->create();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function makeTemplate(array $rule = ['freq' => 'daily'], string $time = '07:30'): Task
    {
        return Task::factory()->for($this->admin, 'creator')->create([
            'title' => 'X投稿',
            'admin_id' => $this->admin->id,
            'due_date' => today()->subDays(3),
            'due_time' => $time,
            'recurrence_rule' => $rule,
            'parent_task_id' => null,
        ]);
    }

    private function makeOccurrence(Task $template, string $date, string $status = 'todo'): Task
    {
        return Task::factory()->for($this->admin, 'creator')->create([
            'title' => $template->title,
            'admin_id' => $this->admin->id,
            'due_date' => $date,
            'due_time' => $template->due_time,
            'parent_task_id' => $template->id,
            'recurrence_rule' => null,
            'status' => $status,
            'completed_at' => $status === 'done' ? now() : null,
        ]);
    }

    public function test_deleted_occurrence_is_not_regenerated(): void
    {
        $template = $this->makeTemplate();
        $service = app(TaskService::class);
        $service->generateUpcomingOccurrences(horizonDays: 3);

        $tomorrow = Task::where('parent_task_id', $template->id)
            ->whereDate('due_date', today()->addDay())
            ->firstOrFail();
        $tomorrow->delete();

        $this->assertSame(0, $service->generateUpcomingOccurrences(horizonDays: 3));
    }

    public function test_updating_template_applies_to_future_todo_occurrences_only(): void
    {
        $template = $this->makeTemplate();
        $past = $this->makeOccurrence($template, '2026-10-04');
        $todayDone = $this->makeOccurrence($template, '2026-10-05', 'done');
        $todayInProgress = $this->makeOccurrence($template, '2026-10-05', 'in_progress');
        $futureTodo = $this->makeOccurrence($template, '2026-10-06');

        app(TaskService::class)->updateRecurringTemplate($template, [
            'title' => 'X投稿（朝）',
            'due_time' => '08:00',
            'recurrence_rule' => ['freq' => 'daily'],
        ]);

        $this->assertSame('X投稿（朝）', $template->fresh()->title);
        $this->assertSame('X投稿（朝）', $futureTodo->fresh()->title);
        $this->assertSame('08:00', substr($futureTodo->fresh()->due_time, 0, 5));
        $this->assertSame('X投稿', $past->fresh()->title);
        $this->assertSame('X投稿', $todayDone->fresh()->title);
        $this->assertSame('X投稿', $todayInProgress->fresh()->title);
    }

    public function test_updating_weekdays_removes_mismatched_future_occurrences_and_fills_new_ones(): void
    {
        $template = $this->makeTemplate(['freq' => 'weekly', 'byweekday' => ['mon', 'tue']]);
        $tuesday = $this->makeOccurrence($template, '2026-10-06');
        $tuesdayDone = $this->makeOccurrence($template, '2026-10-06', 'done');

        app(TaskService::class)->updateRecurringTemplate($template, [
            'title' => 'X投稿',
            'due_time' => '07:30',
            'recurrence_rule' => ['freq' => 'weekly', 'byweekday' => ['mon', 'wed']],
        ]);

        $this->assertNull(Task::withTrashed()->find($tuesday->id), '曜日から外れた未着手分は完全に削除する');
        $this->assertNotNull($tuesdayDone->fresh(), '完了済みは残す');
        $this->assertTrue(
            Task::where('parent_task_id', $template->id)->whereDate('due_date', '2026-10-07')->exists(),
            '新しく追加した曜日の分が生成される'
        );
    }

    public function test_stopping_template_removes_future_todo_occurrences_and_stops_generation(): void
    {
        $template = $this->makeTemplate();
        $past = $this->makeOccurrence($template, '2026-10-04');
        $todayDone = $this->makeOccurrence($template, '2026-10-05', 'done');
        $futureTodo = $this->makeOccurrence($template, '2026-10-06');

        $service = app(TaskService::class);
        $service->stopRecurringTemplate($template);

        $this->assertSoftDeleted($template);
        $this->assertNull(Task::withTrashed()->find($futureTodo->id));
        $this->assertNotNull($past->fresh());
        $this->assertNotNull($todayDone->fresh());
        $this->assertSame(0, $service->generateUpcomingOccurrences(horizonDays: 3));
    }

    public function test_recurring_templates_list_includes_next_occurrence_date(): void
    {
        $template = $this->makeTemplate();
        $this->makeOccurrence($template, '2026-10-04');
        $this->makeOccurrence($template, '2026-10-07');
        $this->makeOccurrence($template, '2026-10-06');
        Task::factory()->for($this->admin, 'creator')->create(['recurrence_rule' => null, 'parent_task_id' => null]);

        $templates = app(TaskService::class)->getRecurringTemplates();

        $this->assertCount(1, $templates);
        $this->assertSame('2026-10-06', $templates->first()->next_occurrence_date);
    }
}
