<?php

namespace App\Repositories\Contracts;

use App\Models\ServicePlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ServicePlanRepositoryInterface
{
  public function query();
  public function findById(string $id): ?ServicePlan;
  public function findBySlug(string $slug): ?ServicePlan;
  public function findWithFilters(array $filters);
  public function paginate(array $filters = [], array $sort = [], int $perPage = 15): LengthAwarePaginator;
  public function getAll(): Collection;
  public function getActive(): Collection;
  public function getByService(string $serviceId): Collection;
  public function getFeatured(): Collection;
  public function buildSearchQuery($query, string $search);
  public function buildStatusFilter($query, string $status);
  public function buildServiceFilter($query, string $serviceId);
  public function buildFeaturedFilter($query, bool $featured);
  public function applySorting($query, array $sort);
  public function create(array $data): ServicePlan;
  public function update(ServicePlan $servicePlan, array $data): ServicePlan;
  public function delete(ServicePlan $servicePlan): bool;
  public function slugExists(string $slug, ?string $excludeId = null): bool;
}
