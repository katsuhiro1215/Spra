<?php

namespace App\Services;

use App\Models\ServiceItem;
use App\Repositories\Contracts\ServiceItemRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ServiceItemService
{
  public function __construct(
    private ServiceItemRepositoryInterface $repository
  ) {}

  public function getPaginatedServiceItems(array $filters = [], array $sort = [])
  {
    return $this->repository->paginate($filters, $sort);
  }

  public function getAllServiceItems()
  {
    return $this->repository->getAll();
  }

  public function getActiveServiceItems()
  {
    return $this->repository->getActive();
  }

  public function getServiceItemsByService(string $serviceId)
  {
    return $this->repository->getByService($serviceId);
  }

  public function getServiceItemsByPlan(string $planId)
  {
    return $this->repository->getByPlan($planId);
  }

  public function getServiceItemsByType(string $type)
  {
    return $this->repository->getByType($type);
  }

  public function getAddons(string $serviceId)
  {
    return $this->repository->getAddons($serviceId);
  }

  public function findServiceItem(string $id): ?ServiceItem
  {
    return $this->repository->findById($id);
  }

  public function createServiceItem(array $data): ServiceItem
  {
    return DB::transaction(function () use ($data) {
      // 作成者を設定
      $data['created_by'] = auth('admin')->id();

      return $this->repository->create($data);
    });
  }

  public function updateServiceItem(ServiceItem $serviceItem, array $data): ServiceItem
  {
    return DB::transaction(function () use ($serviceItem, $data) {
      // 更新者を設定
      $data['updated_by'] = auth('admin')->id();

      return $this->repository->update($serviceItem, $data);
    });
  }

  public function deleteServiceItem(ServiceItem $serviceItem): bool
  {
    return DB::transaction(function () use ($serviceItem) {
      return $this->repository->delete($serviceItem);
    });
  }

  public function getStatuses(): array
  {
    return [
      ['value' => 'active', 'label' => '有効'],
      ['value' => 'inactive', 'label' => '無効'],
    ];
  }

  public function getItemTypes(): array
  {
    return [
      ['value' => 'plan_base', 'label' => 'プラン基本料金'],
      ['value' => 'included', 'label' => 'プラン含まれる項目'],
      ['value' => 'optional', 'label' => 'プラン固有オプション'],
      ['value' => 'addon', 'label' => '全プラン共通オプション'],
    ];
  }
}
