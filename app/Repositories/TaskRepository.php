<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class TaskRepository extends BaseRepository implements TaskRepositoryInterface
{
    public const BOARD_DONE_DAYS = 7;

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
        // 完了列には直近分のみ表示する。それより前の完了タスクは月別の完了済みアーカイブから参照する
        $cutoff = now()->subDays(self::BOARD_DONE_DAYS);

        return $this->applyBoardFilters(Task::whereNull('recurrence_rule'), $filters)
            ->where(function (Builder $query) use ($cutoff) {
                $query->where('status', '!=', 'done')
                    ->orWhereRaw('COALESCE(completed_at, updated_at) >= ?', [$cutoff]);
            })
            ->with(['category', 'admin'])
            ->orderBy('due_date')
            ->orderBy('due_time')
            ->get();
    }

    public function countCompletedByMonth(array $filters): Collection
    {
        return $this->applyBoardFilters($this->completedQuery(), $filters)
            ->selectRaw("DATE_FORMAT(COALESCE(completed_at, updated_at), '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderByDesc('month')
            ->get()
            ->map(fn ($row) => ['month' => $row->month, 'count' => (int) $row->count]);
    }

    public function paginateCompletedInMonth(string $month, array $filters, int $perPage = 50): LengthAwarePaginator
    {
        $start = Carbon::createFromFormat('Y-m-d', $month . '-01')->startOfMonth();

        $query = $this->applyBoardFilters($this->completedQuery(), $filters)
            ->whereRaw('COALESCE(completed_at, updated_at) >= ?', [$start])
            ->whereRaw('COALESCE(completed_at, updated_at) < ?', [$start->copy()->addMonth()]);

        if (!empty($filters['keyword'])) {
            $query->where('title', 'like', '%' . $filters['keyword'] . '%');
        }

        return $query->with(['category', 'admin'])
            ->orderByRaw('COALESCE(completed_at, updated_at) DESC')
            ->paginate($perPage)
            ->withQueryString();
    }

    private function completedQuery(): Builder
    {
        return Task::whereNull('recurrence_rule')->where('status', 'done');
    }

    private function applyBoardFilters(Builder $query, array $filters): Builder
    {
        if (!empty($filters['admin_id'])) {
            $query->where('admin_id', $filters['admin_id']);
        }

        if (!empty($filters['task_category_id'])) {
            $query->where('task_category_id', $filters['task_category_id']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['tag'])) {
            $query->whereJsonContains('tags', $filters['tag']);
        }

        return $query;
    }
}
