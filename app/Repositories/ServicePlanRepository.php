<?php

namespace App\Repositories;

use App\Models\ServicePlan;
use App\Repositories\Contracts\ServicePlanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ServicePlanRepository implements ServicePlanRepositoryInterface
{
  public function query()
  {
    return ServicePlan::query();
  }

  public function findById(string $id): ?ServicePlan
  {
    return ServicePlan::with(['service.serviceCategory', 'creator', 'updater'])->find($id);
  }

  public function findBySlug(string $slug): ?ServicePlan
  {
    return ServicePlan::with(['service.serviceCategory', 'creator', 'updater'])
      ->where('slug', $slug)
      ->first();
  }

  public function findWithFilters(array $filters)
  {
    $query = $this->query()->with(['service.serviceCategory', 'creator', 'updater']);

    if (!empty($filters['search'])) {
      $query = $this->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['status'])) {
      $query = $this->buildStatusFilter($query, $filters['status']);
    }

    if (!empty($filters['service_id'])) {
      $query = $this->buildServiceFilter($query, $filters['service_id']);
    }

    if (isset($filters['is_featured']) && $filters['is_featured'] !== '') {
      $query = $this->buildFeaturedFilter($query, (bool) $filters['is_featured']);
    }

    return $query;
  }

  public function paginate(array $filters = [], array $sort = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = $this->findWithFilters($filters);
    $query = $this->applySorting($query, $sort);

    return $query->paginate($perPage);
  }

  public function getAll(): Collection
  {
    return ServicePlan::with(['service.serviceCategory', 'creator', 'updater'])->get();
  }

  public function getActive(): Collection
  {
    return ServicePlan::with(['service.serviceCategory'])
      ->active()
      ->ordered()
      ->get();
  }

  public function getByService(string $serviceId): Collection
  {
    return ServicePlan::with(['service.serviceCategory'])
      ->byService($serviceId)
      ->ordered()
      ->get();
  }

  public function getFeatured(): Collection
  {
    return ServicePlan::with(['service.serviceCategory'])
      ->featured()
      ->active()
      ->ordered()
      ->get();
  }

  public function buildSearchQuery($query, string $search)
  {
    return $query->where(function ($q) use ($search) {
      $q->where('name', 'like', "%{$search}%")
        ->orWhere('slug', 'like', "%{$search}%")
        ->orWhere('description', 'like', "%{$search}%")
        ->orWhereHas('service', function ($serviceQuery) use ($search) {
          $serviceQuery->where('name', 'like', "%{$search}%");
        });
    });
  }

  public function buildStatusFilter($query, string $status)
  {
    return $query->where('status', $status);
  }

  public function buildServiceFilter($query, string $serviceId)
  {
    return $query->where('service_id', $serviceId);
  }

  public function buildFeaturedFilter($query, bool $featured)
  {
    return $query->where('is_featured', $featured);
  }

  public function applySorting($query, array $sort)
  {
    $field = $sort['field'] ?? 'sort_order';
    $direction = $sort['direction'] ?? 'asc';

    if ($field === 'service_name') {
      return $query->join('services', 'service_plans.service_id', '=', 'services.id')
        ->orderBy('services.name', $direction)
        ->select('service_plans.*');
    }

    return $query->orderBy($field, $direction);
  }

  public function create(array $data): ServicePlan
  {
    return ServicePlan::create($data);
  }

  public function update(ServicePlan $servicePlan, array $data): ServicePlan
  {
    $servicePlan->update($data);
    return $servicePlan->fresh(['service.serviceCategory', 'creator', 'updater']);
  }

  public function delete(ServicePlan $servicePlan): bool
  {
    return $servicePlan->delete();
  }

  public function slugExists(string $slug, ?string $excludeId = null): bool
  {
    $query = ServicePlan::where('slug', $slug);

    if ($excludeId) {
      $query->where('id', '!=', $excludeId);
    }

    return $query->exists();
  }
}
