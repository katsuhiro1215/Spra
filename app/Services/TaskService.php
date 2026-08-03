<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskService extends BaseService
{
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

    public function generateUpcomingOccurrences(int $horizonDays = 14): int
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
        $freq = $rule['freq'] ?? 'daily';
        $byWeekday = ($rule['byweekday'] ?? null) ?: null;

        $existingDates = $this->existingOccurrenceDates($template);

        $created = 0;
        $cursor = today()->greaterThan($template->due_date) ? today()->copy() : $template->due_date->copy();
        $until = today()->addDays($horizonDays);

        while ($cursor->lte($until)) {
            $matches = match ($freq) {
                'daily' => true,
                'weekly' => $byWeekday === null || in_array(strtolower($cursor->format('D')), array_map('strtolower', $byWeekday), true),
                default => false,
            };

            if ($matches && ! in_array($cursor->format('Y-m-d'), $existingDates, true)) {
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

    private function existingOccurrenceDates(Task $template): array
    {
        return Task::where('parent_task_id', $template->id)
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
