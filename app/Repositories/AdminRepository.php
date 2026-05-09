<?php

namespace App\Repositories;

use App\Models\Admin;
use App\Repositories\Contracts\AdminRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminRepository implements AdminRepositoryInterface
{
    public function query(): Builder
    {
        return Admin::query();
    }

    public function findById(string $id): ?Admin
    {
        return Admin::find($id);
    }

    public function findByEmail(string $email): ?Admin
    {
        return Admin::where('email', $email)->first();
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = Admin::query();

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

        if (!empty($filters['role'])) {
            $query = $this->buildRoleFilter($query, $filters['role']);
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
            $q->where('email', 'like', "%{$search}%")
                ->orWhereHas('profile', function ($pq) use ($search) {
                    $pq->where('last_name', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%");
                });
        });
    }

    public function buildRoleFilter(Builder $query, string $role): Builder
    {
        return $query->where('role', $role);
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

    public function create(array $data): Admin
    {
        return Admin::create($data);
    }

    public function update(Admin $admin, array $data): Admin
    {
        $admin->update($data);
        return $admin->fresh();
    }

    public function delete(Admin $admin): bool
    {
        return $admin->delete();
    }
}
