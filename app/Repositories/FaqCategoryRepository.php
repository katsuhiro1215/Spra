<?php

namespace App\Repositories;

use App\Models\FaqCategory;
use App\Repositories\Contracts\FaqCategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class FaqCategoryRepository implements FaqCategoryRepositoryInterface
{
    public function query(): Builder
    {
        return FaqCategory::query();
    }

    public function findById(string $id): ?FaqCategory
    {
        return FaqCategory::find($id);
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = FaqCategory::query();

        // ソフトデリートフィルター
        if (isset($filters['trashed'])) {
            if ($filters['trashed'] === 'with_trashed') {
                $query->withTrashed();
            } elseif ($filters['trashed'] === 'only_trashed') {
                $query->onlyTrashed();
            }
            // 'without_trashed' の場合はデフォルト（削除されていないもののみ）
        }

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
            $sort['field'] ?? 'created_at',
            $sort['direction'] ?? 'desc'
        );

        return $query->with('profile')->paginate($perPage)->withQueryString();
    }

    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        });
    }

    public function buildStatusFilter(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder
    {
        $allowed = ['created_at', 'email', 'role', 'status', 'last_login_at'];
        $field = in_array($field, $allowed) ? $field : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($field, $direction);
    }

    public function create(array $data): FaqCategory
    {
        return FaqCategory::create($data);
    }

    public function update(FaqCategory $faqCategory, array $data): FaqCategory
    {
        $faqCategory->update($data);
        return $faqCategory->fresh();
    }

    public function delete(FaqCategory $faqCategory): bool
    {
        return $faqCategory->delete();
    }

    public function getStats(): array
    {
        return [
            'total' => FaqCategory::count(),
            'active' => FaqCategory::where('status', 'active')->count(),
            'inactive' => FaqCategory::where('status', 'inactive')->count(),
        ];
    }
}
