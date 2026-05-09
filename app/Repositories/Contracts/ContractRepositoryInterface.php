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

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function paginateForClient(string $userId, int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function create(array $data): Contract;

  public function update(Contract $contract, array $data): Contract;

  public function getActiveByUser(string $userId): Collection;

  public function getExpiringContracts(int $daysAhead = 30): Collection;
}
