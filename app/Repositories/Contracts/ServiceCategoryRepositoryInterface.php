<?php

namespace App\Repositories\Contracts;

use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ServiceCategoryRepositoryInterface
{
  public function query(): Builder;

  public function findById(string $id): ?ServiceCategory;

  public function findBySlug(string $slug): ?ServiceCategory;

  public function findWithFilters(array $filters): Builder;

  public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;

  public function getAll(): Collection;

  public function getActive(): Collection;

  public function buildSearchQuery(Builder $query, string $search): Builder;

  public function buildStatusFilter(Builder $query, string $status): Builder;

  public function applySorting(Builder $query, string $field, string $direction = 'asc'): Builder;

  public function create(array $data): ServiceCategory;

  public function update(ServiceCategory $serviceCategory, array $data): ServiceCategory;

  public function delete(ServiceCategory $serviceCategory): bool;
}
