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

        return $this->repository->create($data);
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
        $byWeekday = $rule['byweekday'] ?? null;

        // テンプレート自身のdue_dateはその日の実体を兼ねるため、既存扱いにして重複生成を防ぐ
        $existingDates = Task::where('parent_task_id', $template->id)
            ->pluck('due_date')
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->push($template->due_date->format('Y-m-d'))
            ->all();

        $created = 0;
        $cursor = today();
        $until = today()->addDays($horizonDays);

        while ($cursor->lte($until)) {
            $matches = match ($freq) {
                'daily' => true,
                'weekly' => $byWeekday === null || in_array(strtolower($cursor->format('D')), array_map('strtolower', $byWeekday), true),
                default => false,
            };

            if ($matches && ! in_array($cursor->format('Y-m-d'), $existingDates, true)) {
                $this->repository->create([
                    'title' => $template->title,
                    'description' => $template->description,
                    'priority' => $template->priority,
                    'task_category_id' => $template->task_category_id,
                    'tags' => $template->tags,
                    'admin_id' => $template->admin_id,
                    'created_by' => $template->created_by,
                    'due_date' => $cursor->format('Y-m-d'),
                    'due_time' => $template->due_time,
                    'parent_task_id' => $template->id,
                    'status' => 'todo',
                ]);
                $created++;
            }

            $cursor->addDay();
        }

        return $created;
    }
}
