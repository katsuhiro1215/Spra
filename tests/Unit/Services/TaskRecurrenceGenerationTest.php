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

    public function test_generates_weekly_occurrences_only_on_matching_weekdays(): void
    {
        $admin = Admin::factory()->create();
        $byWeekday = ['mon', 'thu'];
        $horizonDays = 14;

        $template = Task::factory()->for($admin, 'creator')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'recurrence_rule' => ['freq' => 'weekly', 'byweekday' => $byWeekday],
            'parent_task_id' => null,
        ]);

        // TaskService::generateOccurrencesForTemplate() と同じ範囲・条件で期待値を自前で計算する
        // （今日が何曜日でも決定的に検証できるように、ハードコードした件数には頼らない）
        $expectedDates = [];
        $cursor = today();
        $until = today()->addDays($horizonDays);
        while ($cursor->lte($until)) {
            $isMatchingWeekday = in_array(strtolower($cursor->format('D')), $byWeekday, true);
            // テンプレート自身のdue_date（today）は既存扱いのため生成対象から除外される
            if ($isMatchingWeekday && ! $cursor->isSameDay(today())) {
                $expectedDates[] = $cursor->format('Y-m-d');
            }
            $cursor->addDay();
        }

        $service = app(TaskService::class);
        $created = $service->generateUpcomingOccurrences(horizonDays: $horizonDays);

        $this->assertSame(count($expectedDates), $created);

        $actualDates = Task::where('parent_task_id', $template->id)
            ->pluck('due_date')
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->sort()
            ->values()
            ->all();

        sort($expectedDates);
        $this->assertSame($expectedDates, $actualDates);

        // 全ての生成された実体タスクが指定曜日のいずれかであることを確認する
        foreach ($actualDates as $date) {
            $this->assertContains(strtolower(\Carbon\Carbon::parse($date)->format('D')), $byWeekday);
        }
    }
}
