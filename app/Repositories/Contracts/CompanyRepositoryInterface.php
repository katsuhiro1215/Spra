<?php

namespace App\Repositories\Contracts;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CompanyRepositoryInterface
{
  public function query(): Builder;

  public function all(array $filters = []): Collection;

  public function findById(string $id, array $with = []): ?Company;

  public function findWithFilters(array $filters): Builder;

  public function paginate(int $perPage = 15, array $filters = [], string $sortField = 'created_at', string $sortDirection = 'desc'): LengthAwarePaginator;

  public function create(array $data): Company;

  public function update(Company $company, array $data): Company;

  public function delete(Company $company): bool;

  public function bulkDelete(array $ids): int;

  public function attachUser(Company $company, string $userId, array $pivotData = []): void;

  public function detachUser(Company $company, string $userId): void;

  public function getStats(): array;
}
