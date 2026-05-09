<?php

namespace App\Services;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ServiceService
{
  public function __construct(
    private ServiceRepositoryInterface $serviceRepository
  ) {}

  /**
   * Get paginated services with filters and sorting.
   */
  public function getPaginatedServices(array $filters = [], array $sort = [], int $perPage = 15): LengthAwarePaginator
  {
    return $this->serviceRepository->paginate($filters, $sort, $perPage);
  }

  /**
   * Get all services.
   */
  public function getAllServices(): Collection
  {
    return $this->serviceRepository->getAll();
  }

  /**
   * Get active services.
   */
  public function getActiveServices(): Collection
  {
    return $this->serviceRepository->getActive();
  }

  /**
   * Get featured services.
   */
  public function getFeaturedServices(): Collection
  {
    return $this->serviceRepository->getFeatured();
  }

  /**
   * Get services by category.
   */
  public function getServicesByCategory(string $categoryId): Collection
  {
    return $this->serviceRepository->getByCategory($categoryId);
  }

  /**
   * Find service by ID.
   */
  public function findServiceById(string $id): ?Service
  {
    return $this->serviceRepository->findById($id);
  }

  /**
   * Find service by slug.
   */
  public function findServiceBySlug(string $slug): ?Service
  {
    return $this->serviceRepository->findBySlug($slug);
  }

    /**
     * サービスの統計情報を取得
     */
    public function getServiceStats(): array
    {
        return [
            'all' => Service::withTrashed()->count(),
            'active' => Service::count(),
            'trashed' => Service::onlyTrashed()->count(),
        ];
    }

  /**
   * Create new service.
   */
  public function createService(array $data): Service
  {
    return DB::transaction(function () use ($data) {
      // Generate slug if not provided
      if (empty($data['slug'])) {
        $data['slug'] = $this->generateUniqueSlug($data['name']);
      }

      // Set created_by
      if (Auth::guard('admins')->check()) {
        $data['created_by'] = Auth::guard('admins')->id();
        $data['updated_by'] = Auth::guard('admins')->id();
      }

      return $this->serviceRepository->create($data);
    });
  }

  /**
   * Update service.
   */
  public function updateService(Service $service, array $data): Service
  {
    return DB::transaction(function () use ($service, $data) {
      // Update slug if name changed and slug not provided
      if (isset($data['name']) && $data['name'] !== $service->name && empty($data['slug'])) {
        $data['slug'] = $this->generateUniqueSlug($data['name'], $service->id);
      }

      // Set updated_by
      if (Auth::guard('admins')->check()) {
        $data['updated_by'] = Auth::guard('admins')->id();
      }

      $this->serviceRepository->update($service, $data);

      return $service->fresh();
    });
  }

  /**
   * Delete service.
   */
  public function deleteService(Service $service): bool
  {
    return DB::transaction(function () use ($service) {
      // Check if service has related service plans
      if ($service->servicePlans()->count() > 0) {
        throw new \Exception('このサービスには関連するプランが存在するため削除できません。');
      }

      return $this->serviceRepository->delete($service);
    });
  }

  /**
   * Restore soft deleted service.
   */
  public function restoreService(Service $service): bool
  {
    return $this->serviceRepository->restore($service);
  }

  /**
   * Get available statuses.
   */
  public function getStatuses(): array
  {
    return [
      ['value' => 'active', 'label' => '稼働中'],
      ['value' => 'inactive', 'label' => '停止中'],
      ['value' => 'suspended', 'label' => '一時停止'],
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

    while ($this->serviceRepository->slugExists($slug, $excludeId)) {
      $slug = $originalSlug . '-' . $counter;
      $counter++;
    }

    return $slug;
  }
}
