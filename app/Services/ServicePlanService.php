<?php

namespace App\Services;

use App\Models\ServicePlan;
use App\Repositories\Contracts\ServicePlanRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ServicePlanService
{
  public function __construct(
    private ServicePlanRepositoryInterface $repository
  ) {}

  public function getPaginatedServicePlans(array $filters = [], array $sort = [])
  {
    return $this->repository->paginate($filters, $sort);
  }

  public function getAllServicePlans()
  {
    return $this->repository->getAll();
  }

  public function getActiveServicePlans()
  {
    return $this->repository->getActive();
  }

  public function getServicePlansByService(string $serviceId)
  {
    return $this->repository->getByService($serviceId);
  }

  public function getFeaturedServicePlans()
  {
    return $this->repository->getFeatured();
  }

  public function findServicePlan(string $id): ?ServicePlan
  {
    return $this->repository->findById($id);
  }

  public function findServicePlanBySlug(string $slug): ?ServicePlan
  {
    return $this->repository->findBySlug($slug);
  }

  public function createServicePlan(array $data): ServicePlan
  {
    return DB::transaction(function () use ($data) {
      // Slug生成
      if (empty($data['slug'])) {
        $data['slug'] = $this->generateUniqueSlug($data['name']);
      } else {
        // 既存のslugがある場合は重複チェック
        if ($this->repository->slugExists($data['slug'])) {
          $data['slug'] = $this->generateUniqueSlug($data['name']);
        }
      }

      // 作成者を設定
      $data['created_by'] = auth('admin')->id();

      return $this->repository->create($data);
    });
  }

  public function updateServicePlan(ServicePlan $servicePlan, array $data): ServicePlan
  {
    return DB::transaction(function () use ($servicePlan, $data) {
      // Slugの重複チェック（自分以外）
      if (!empty($data['slug']) && $data['slug'] !== $servicePlan->slug) {
        if ($this->repository->slugExists($data['slug'], $servicePlan->id)) {
          $data['slug'] = $this->generateUniqueSlug($data['name'], $servicePlan->id);
        }
      }

      // 更新者を設定
      $data['updated_by'] = auth('admin')->id();

      return $this->repository->update($servicePlan, $data);
    });
  }

  public function deleteServicePlan(ServicePlan $servicePlan): bool
  {
    return DB::transaction(function () use ($servicePlan) {
      // 関連するServiceItemsがある場合は削除を防ぐ
      if ($servicePlan->serviceItems()->exists()) {
        throw new \Exception('このプランには関連するサービス項目があるため削除できません。');
      }

      return $this->repository->delete($servicePlan);
    });
  }

  public function getStatuses(): array
  {
    return [
      ['value' => 'active', 'label' => '稼働中'],
      ['value' => 'inactive', 'label' => '停止中'],
      ['value' => 'suspended', 'label' => '一時停止'],
    ];
  }

  public function getBillingCycles(): array
  {
    return [
      ['value' => 'one_time', 'label' => '一回限り'],
      ['value' => 'monthly', 'label' => '月額'],
      ['value' => 'quarterly', 'label' => '四半期'],
      ['value' => 'yearly', 'label' => '年額'],
    ];
  }

  /**
   * Generate unique slug.
   */
  private function generateUniqueSlug(string $name, ?string $excludeId = null): string
  {
    $slug = Str::slug($name);
    $originalSlug = $slug;
    $counter = 1;

    while ($this->repository->slugExists($slug, $excludeId)) {
      $slug = $originalSlug . '-' . $counter;
      $counter++;
    }

    return $slug;
  }
}
