<?php

namespace App\Repositories\Contracts;

use App\Models\Contract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContractRepositoryInterface
{
    public function query(): Builder;
    public function findById(string $id): ?Contract;
    public function findByIdForClient(string $id, string $userId): ?Contract;
    public function findWithFilters(array $filters): Builder;
    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function buildSearchQuery(Builder $query, string $search): Builder;
    public function buildStatusFilter(Builder $query, string $status): Builder;
    public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder;
    public function create(array $data): Contract;
    public function update(Contract $contract, array $data): Contract;
    public function delete(Contract $contract): bool;
    public function getActiveByUser(string $userId): Collection;
    public function getExpiringContracts(int $daysAhead = 30): Collection;
    public function getStats(): array;
}
