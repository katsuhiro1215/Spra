<?php

namespace App\Repositories\Contracts;

use App\Models\ServiceItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ServiceItemRepositoryInterface
{
  public function query();
  public function findById(string $id): ?ServiceItem;
  public function findWithFilters(array $filters);
  public function paginate(array $filters = [], array $sort = [], int $perPage = 15): LengthAwarePaginator;
  public function getAll(): Collection;
  public function getActive(): Collection;
  public function getByService(string $serviceId): Collection;
  public function getByPlan(string $planId): Collection;
  public function getByType(string $type): Collection;
  public function getAddons(string $serviceId): Collection;
  public function buildSearchQuery($query, string $search);
  public function buildStatusFilter($query, string $status);
  public function buildServiceFilter($query, string $serviceId);
  public function buildPlanFilter($query, string $planId);
  public function buildTypeFilter($query, string $type);
  public function applySorting($query, array $sort);
  public function create(array $data): ServiceItem;
  public function update(ServiceItem $serviceItem, array $data): ServiceItem;
  public function delete(ServiceItem $serviceItem): bool;
}
