<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TaskService extends BaseService
{
    private const HORIZON_DAYS = 14;

    public function __construct(TaskRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Task';
    }

    public function createTask(array $data, string $creatorId): Task
    {
        $data['created_by'] = $creatorId;
        $data['status'] ??= 'todo';
        $data['priority'] ??= 'medium';

        $task = $this->repository->create($data);

        if ($task->recurrence_rule) {
            $this->generateInitialOccurrence($task);
        }

        return $task;
    }

    public function updateStatus(Task $task, string $status): Task
    {
        $data = ['status' => $status];
        $data['completed_at'] = $status === 'done' ? now() : null;

        return $this->repository->update($task, $data);
    }

    public function getTodayForAdmin(string $adminId): Collection
    {
        return $this->repository->findTodayForAdmin($adminId);
    }

    public function getAssignedTo(string $adminId, int $limit = 10): Collection
    {
        return $this->repository->findAssignedTo($adminId, $limit);
    }

    public function getForBoard(array $filters): Collection
    {
        return $this->repository->findForBoard($filters);
    }

    public function getCompletedMonthlyCounts(array $filters): Collection
    {
        return $this->repository->countCompletedByMonth($filters);
    }

    public function getCompletedInMonth(string $month, array $filters): LengthAwarePaginator
    {
        return $this->repository->paginateCompletedInMonth($month, $filters);
    }

    public function getTasksNeedingReminder(int $withinMinutes = 30): Collection
    {
        $now = now();
        $windowEnd = $now->copy()->addMinutes($withinMinutes);

        return Task::whereNotNull('admin_id')
            ->whereNotNull('due_time')
            ->whereDate('due_date', today())
            ->where('status', '!=', 'done')
            ->whereNull('recurrence_rule')
            ->whereNull('reminder_sent_at')
            ->get()
            ->filter(function (Task $task) use ($now, $windowEnd) {
                $dueAt = \Carbon\Carbon::parse($task->due_date->format('Y-m-d') . ' ' . $task->due_time);

                return $dueAt->between($now, $windowEnd);
            });
    }

    /**
     * 繰り返し設定（テンプレート行）の一覧。次回予定日（今日以降で最も近い実体タスクの期限日）を付与して返す。
     */
    public function getRecurringTemplates(): Collection
    {
        $templates = Task::whereNull('parent_task_id')
            ->whereNotNull('recurrence_rule')
            ->with(['category', 'admin'])
            ->orderBy('due_time')
            ->orderBy('title')
            ->get();

        $nextDates = Task::whereIn('parent_task_id', $templates->pluck('id'))
            ->whereDate('due_date', '>=', today())
            ->selectRaw('parent_task_id, MIN(due_date) as next_date')
            ->groupBy('parent_task_id')
            ->pluck('next_date', 'parent_task_id');

        return $templates->each(function (Task $template) use ($nextDates) {
            $next = $nextDates[$template->id] ?? null;
            $template->setAttribute('next_occurrence_date', $next ? Carbon::parse($next)->format('Y-m-d') : null);
        });
    }

    /**
     * 繰り返し設定を更新し、今日以降の未着手の実体タスクにも反映する。
     * 着手済み・完了済み・過去日の実体タスクは記録として残すため変更しない。
     */
    public function updateRecurringTemplate(Task $template, array $data): Task
    {
        return DB::transaction(function () use ($template, $data) {
            $template = $this->repository->update($template, $data);

            $fields = [
                'title' => $template->title,
                'description' => $template->description,
                'priority' => $template->priority,
                'task_category_id' => $template->task_category_id,
                'tags' => $template->tags,
                'admin_id' => $template->admin_id,
                'due_time' => $template->due_time,
                'reminder_sent_at' => null,
            ];

            foreach ($this->upcomingTodoOccurrences($template) as $occurrence) {
                if ($this->matchesRule($template->recurrence_rule, $occurrence->due_date)) {
                    $occurrence->update($fields);
                } else {
                    // 自動生成された未着手分なので履歴として残す必要は無い。
                    // 論理削除にすると、後で同じ曜日を戻した際に「生成済み」扱いになり再生成されなくなる
                    $occurrence->forceDelete();
                }
            }

            $this->generateOccurrencesForTemplate($template, self::HORIZON_DAYS);

            return $template;
        });
    }

    /**
     * 繰り返しを停止する。今日以降の未着手の実体タスクを削除し、テンプレートを論理削除する。
     */
    public function stopRecurringTemplate(Task $template): void
    {
        DB::transaction(function () use ($template) {
            $this->upcomingTodoOccurrences($template)->each->forceDelete();
            $this->repository->delete($template);
        });
    }

    private function upcomingTodoOccurrences(Task $template): Collection
    {
        return Task::where('parent_task_id', $template->id)
            ->where('status', 'todo')
            ->whereDate('due_date', '>=', today())
            ->get();
    }

    public function generateUpcomingOccurrences(int $horizonDays = self::HORIZON_DAYS): int
    {
        $templates = Task::whereNull('parent_task_id')
            ->whereNotNull('recurrence_rule')
            ->get();

        $createdCount = 0;

        foreach ($templates as $template) {
            $createdCount += $this->generateOccurrencesForTemplate($template, $horizonDays);
        }

        return $createdCount;
    }

    private function generateOccurrencesForTemplate(Task $template, int $horizonDays): int
    {
        $rule = $template->recurrence_rule;

        $existingDates = $this->existingOccurrenceDates($template);

        $created = 0;
        $cursor = today()->greaterThan($template->due_date) ? today()->copy() : $template->due_date->copy();
        $until = today()->addDays($horizonDays);

        while ($cursor->lte($until)) {
            if ($this->matchesRule($rule, $cursor) && ! in_array($cursor->format('Y-m-d'), $existingDates, true)) {
                $this->createOccurrence($template, $cursor->format('Y-m-d'));
                $existingDates[] = $cursor->format('Y-m-d');
                $created++;
            }

            $cursor->addDay();
        }

        return $created;
    }

    /**
     * 繰り返しタスク作成直後、テンプレート自身のdue_date分を即時に1件だけ生成する。
     * テンプレート行はカンバンボード等の一覧から常に除外される設計のため、これが無いと
     * 日次バッチ（06:10）が走るまで、作成したタスクがdue_dateの当日・将来日を問わず
     * どこにも表示されなくなってしまう。
     */
    private function generateInitialOccurrence(Task $template): void
    {
        $dueDate = $template->due_date->format('Y-m-d');

        if (in_array($dueDate, $this->existingOccurrenceDates($template), true)) {
            return;
        }

        $this->createOccurrence($template, $dueDate);
    }

    private function matchesRule(array $rule, Carbon $date): bool
    {
        $byWeekday = ($rule['byweekday'] ?? null) ?: null;

        return match ($rule['freq'] ?? 'daily') {
            'daily' => true,
            'weekly' => $byWeekday === null || in_array(strtolower($date->format('D')), array_map('strtolower', $byWeekday), true),
            default => false,
        };
    }

    /**
     * 削除済みの実体タスクも「生成済み」として扱う。
     * 含めないと、未来日の1件だけを削除しても翌朝の日次バッチで同じ日付分が再生成されてしまう。
     */
    private function existingOccurrenceDates(Task $template): array
    {
        return Task::withTrashed()
            ->where('parent_task_id', $template->id)
            ->pluck('due_date')
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->all();
    }

    private function createOccurrence(Task $template, string $dueDate): void
    {
        $this->repository->create([
            'title' => $template->title,
            'description' => $template->description,
            'priority' => $template->priority,
            'task_category_id' => $template->task_category_id,
            'tags' => $template->tags,
            'admin_id' => $template->admin_id,
            'created_by' => $template->created_by,
            'due_date' => $dueDate,
            'due_time' => $template->due_time,
            'parent_task_id' => $template->id,
            'status' => 'todo',
        ]);
    }
}
