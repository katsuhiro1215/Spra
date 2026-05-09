<?php

namespace App\Repositories;

use App\Models\ServiceItem;
use App\Repositories\Contracts\ServiceItemRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ServiceItemRepository implements ServiceItemRepositoryInterface
{
  public function query()
  {
    return ServiceItem::query();
  }

  public function findById(string $id): ?ServiceItem
  {
    return ServiceItem::with(['service', 'servicePlan', 'creator', 'updater'])->find($id);
  }

  public function findWithFilters(array $filters)
  {
    $query = $this->query()->with(['service', 'servicePlan', 'creator', 'updater']);

    if (!empty($filters['search'])) {
      $query = $this->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['status'])) {
      $query = $this->buildStatusFilter($query, $filters['status']);
    }

    if (!empty($filters['service_id'])) {
      $query = $this->buildServiceFilter($query, $filters['service_id']);
    }

    if (!empty($filters['service_plan_id'])) {
      $query = $this->buildPlanFilter($query, $filters['service_plan_id']);
    }

    if (!empty($filters['item_type'])) {
      $query = $this->buildTypeFilter($query, $filters['item_type']);
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
    return ServiceItem::with(['service', 'servicePlan', 'creator', 'updater'])->get();
  }

  public function getActive(): Collection
  {
    return ServiceItem::with(['service', 'servicePlan'])
      ->active()
      ->ordered()
      ->get();
  }

  public function getByService(string $serviceId): Collection
  {
    return ServiceItem::with(['servicePlan'])
      ->byService($serviceId)
      ->ordered()
      ->get();
  }

  public function getByPlan(string $planId): Collection
  {
    return ServiceItem::with(['service'])
      ->byPlan($planId)
      ->ordered()
      ->get();
  }

  public function getByType(string $type): Collection
  {
    return ServiceItem::with(['service', 'servicePlan'])
      ->byType($type)
      ->ordered()
      ->get();
  }

  public function getAddons(string $serviceId): Collection
  {
    return ServiceItem::byService($serviceId)
      ->addons()
      ->active()
      ->ordered()
      ->get();
  }

  public function buildSearchQuery($query, string $search)
  {
    return $query->where(function ($q) use ($search) {
      $q->where('name', 'like', "%{$search}%")
        ->orWhere('description', 'like', "%{$search}%")
        ->orWhereHas('service', function ($serviceQuery) use ($search) {
          $serviceQuery->where('name', 'like', "%{$search}%");
        })
        ->orWhereHas('servicePlan', function ($planQuery) use ($search) {
          $planQuery->where('name', 'like', "%{$search}%");
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

  public function buildPlanFilter($query, string $planId)
  {
    return $query->where('service_plan_id', $planId);
  }

  public function buildTypeFilter($query, string $type)
  {
    return $query->where('item_type', $type);
  }

  public function applySorting($query, array $sort)
  {
    $field = $sort['field'] ?? 'sort_order';
    $direction = $sort['direction'] ?? 'asc';

    if ($field === 'service_name') {
      return $query->join('services', 'service_items.service_id', '=', 'services.id')
        ->orderBy('services.name', $direction)
        ->select('service_items.*');
    }

    if ($field === 'plan_name') {
      return $query->leftJoin('service_plans', 'service_items.service_plan_id', '=', 'service_plans.id')
        ->orderBy('service_plans.name', $direction)
        ->select('service_items.*');
    }

    return $query->orderBy($field, $direction);
  }

  public function create(array $data): ServiceItem
  {
    return ServiceItem::create($data);
  }

  public function update(ServiceItem $serviceItem, array $data): ServiceItem
  {
    $serviceItem->update($data);
    return $serviceItem->fresh(['service', 'servicePlan', 'creator', 'updater']);
  }

  public function delete(ServiceItem $serviceItem): bool
  {
    return $serviceItem->delete();
  }
}
