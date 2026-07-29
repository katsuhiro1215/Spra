<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectRepository extends SoftDeletableRepository implements ProjectRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Project::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'title', 'status', 'start_date', 'estimated_end_date'];
    }

    protected function getDefaultRelations(): array
    {
        return ['user', 'company', 'admins.profile'];
    }

    /**
     * 詳細画面向けに全関連データを読み込んで取得する（一覧用のgetDefaultRelations()より重いため個別実装）
     */
    public function findById(string $id): mixed
    {
        return Project::with(['user', 'company', 'admins.profile', 'milestones', 'contracts', 'technologies'])->find($id);
    }

    public function findByIdForClient(string $id, string $userId): ?Project
    {
        return Project::where('id', $id)
            ->where('user_id', $userId)
            ->where('is_client_visible', true)
            ->with([
                'milestones' => fn($q) => $q->where('is_client_visible', true)
                    ->whereHas('projectVersion', fn($v) => $v->where('is_current', true)),
                'updates' => fn($q) => $q->clientVisible(),
                'contract',
                'technologies',
                'admins.profile.media',
                'currentVersion.items' => fn($q) => $q->where('is_client_visible', true)->orderBy('sort_order'),
                'currentVersion.items.assignee.profile',
            ])
            ->first();
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        if (!empty($filters['admin_id'])) {
            $query->whereHas('admins', fn($q) => $q->where('admins.id', $filters['admin_id']));
        }

        return $query;
    }

    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
    {
        $query = Project::where('user_id', $userId)
            ->where('is_client_visible', true)
            ->with([
                'milestones' => fn($q) => $q->where('is_client_visible', true)
                    ->whereHas('projectVersion', fn($v) => $v->where('is_current', true)),
                'admins.profile.media',
            ]);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $this->applySorting(
            $query,
            $sort['field'] ?? $this->getDefaultSortField(),
            $sort['direction'] ?? 'desc'
        )->paginate($perPage);
    }

    public function syncCategories(Project $project, array $categoryIds): void
    {
        $project->categories()->sync($categoryIds);
    }

    public function getActiveByUser(string $userId): Collection
    {
        return Project::where('user_id', $userId)
            ->whereIn('status', ['in_progress', 'review'])
            ->where('is_client_visible', true)
            ->get();
    }
}
