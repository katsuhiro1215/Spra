<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface
{
  public function query(): Builder;

  public function findById(string $id): ?Project;

  public function findByIdForClient(string $id, string $userId): ?Project;

  public function findWithFilters(array $filters): Builder;

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function paginateForClient(string $userId, int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function create(array $data): Project;

  public function update(Project $project, array $data): Project;

  public function delete(Project $project): bool;

  public function syncCategories(Project $project, array $categoryIds): void;

  public function getActiveByUser(string $userId): Collection;
}
