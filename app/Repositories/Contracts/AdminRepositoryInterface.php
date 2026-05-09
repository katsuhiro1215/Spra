<?php

namespace App\Repositories\Contracts;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface AdminRepositoryInterface
{
    public function query(): Builder;

    public function findById(string $id): ?Admin;

    public function findByEmail(string $email): ?Admin;

    public function findWithFilters(array $filters): Builder;

    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;

    public function buildSearchQuery(Builder $query, string $search): Builder;

    public function buildRoleFilter(Builder $query, string $role): Builder;

    public function buildStatusFilter(Builder $query, string $status): Builder;

    public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder;

    public function create(array $data): Admin;

    public function update(Admin $admin, array $data): Admin;

    public function delete(Admin $admin): bool;
}
