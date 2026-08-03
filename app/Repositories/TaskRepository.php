<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskRepository extends BaseRepository implements TaskRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Task::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['due_date', 'priority', 'created_at'];
    }

    public function findTodayForAdmin(string $adminId): Collection
    {
        return Task::where('admin_id', $adminId)
            ->whereDate('due_date', today())
            ->where('status', '!=', 'done')
            ->whereNull('recurrence_rule')
            ->orderBy('due_time')
            ->get();
    }

    public function findAssignedTo(string $adminId, int $limit = 10): Collection
    {
        return Task::where('admin_id', $adminId)
            ->whereNull('recurrence_rule')
            ->where('status', '!=', 'done')
            ->orderBy('due_date')
            ->orderBy('due_time')
            ->limit($limit)
            ->get();
    }

    public function findForBoard(array $filters): Collection
    {
        $query = Task::whereNull('recurrence_rule')
            ->with(['category', 'admin']);

        if (!empty($filters['admin_id'])) {
            $query->where('admin_id', $filters['admin_id']);
        }

        if (!empty($filters['task_category_id'])) {
            $query->where('task_category_id', $filters['task_category_id']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        return $query->orderBy('due_date')->orderBy('due_time')->get();
    }
}
