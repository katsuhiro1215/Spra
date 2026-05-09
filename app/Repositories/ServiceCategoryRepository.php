<?php

namespace App\Repositories;

use App\Models\ServiceCategory;
use App\Repositories\Contracts\ServiceCategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceCategoryRepository implements ServiceCategoryRepositoryInterface
{
    public function query(): Builder
    {
        return ServiceCategory::query();
    }

    public function findById(string $id): ?ServiceCategory
    {
        return ServiceCategory::with(['creator', 'updater'])->find($id);
    }

    public function findBySlug(string $slug): ?ServiceCategory
    {
        return ServiceCategory::where('slug', $slug)->first();
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = ServiceCategory::query();

        // Apply trashed filter
        $query = $this->applyTrashedFilter($query, $filters['trashed'] ?? 'without_trashed');

        if (!empty($filters['search'])) {
            $query = $this->buildSearchQuery($query, $filters['search']);
        }

        if (!empty($filters['status'])) {
            $query = $this->buildStatusFilter($query, $filters['status']);
        }

        return $query;
    }

    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
    {
        $query = $this->findWithFilters($filters);
        $query = $this->applySorting(
            $query,
            $sort['field'] ?? 'sort_order',
            $sort['direction'] ?? 'asc'
        );

        return $query->with(['creator', 'updater'])
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAll(): Collection
    {
        return ServiceCategory::orderBy('sort_order')->get();
    }

    public function getActive(): Collection
    {
        return ServiceCategory::where('status', 'active')
            ->orderBy('sort_order')
            ->get();
    }

    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function buildStatusFilter(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Apply trashed filter.
     */
    public function applyTrashedFilter(Builder $query, string $trashed): Builder
    {
        return match ($trashed) {
            'only_trashed' => $query->onlyTrashed(),
            'with_trashed' => $query->withTrashed(),
            default => $query, // 'without_trashed'
        };
    }

    public function applySorting(Builder $query, string $field, string $direction = 'asc'): Builder
    {
        $allowed = ['name', 'slug', 'sort_order', 'status', 'created_at', 'updated_at'];
        $field = in_array($field, $allowed) ? $field : 'sort_order';
        $direction = $direction === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($field, $direction);
    }

    public function create(array $data): ServiceCategory
    {
        return ServiceCategory::create($data);
    }

    public function update(ServiceCategory $serviceCategory, array $data): ServiceCategory
    {
        $serviceCategory->update($data);
        return $serviceCategory->fresh(['creator', 'updater']);
    }

    public function delete(ServiceCategory $serviceCategory): bool
    {
        return $serviceCategory->delete();
    }
}
