<?php

namespace App\Services;

use App\Models\ServiceCategory;
use App\Repositories\ServiceCategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ServiceCategoryService
{
  public function __construct(
    private ServiceCategoryRepository $repository
  ) {}

  /**
   * ページネーション付きでサービスカテゴリ一覧を取得
   */
  public function getPaginatedServiceCategories(array $filters = [], array $sort = [], int $perPage = 20): LengthAwarePaginator
  {
    return $this->repository->paginate($perPage, $filters, $sort);
  }

  /**
   * 全サービスカテゴリを取得
   */
  public function getAllServiceCategories(): Collection
  {
    return $this->repository->getAll();
  }

  /**
   * アクティブなサービスカテゴリを取得
   */
  public function getActiveServiceCategories(): Collection
  {
    return $this->repository->getActive();
  }

  /**
   * IDでサービスカテゴリを取得
   */
  public function findById(string $id): ?ServiceCategory
  {
    return $this->repository->findById($id);
  }

  /**
   * スラッグでサービスカテゴリを取得
   */
  public function findBySlug(string $slug): ?ServiceCategory
  {
    return $this->repository->findBySlug($slug);
  }

    /**
     * サービスカテゴリの統計情報を取得
     */
    public function getServiceCategoryStats(): array
    {
        return [
            'all' => ServiceCategory::withTrashed()->count(),
            'active' => ServiceCategory::count(),
            'trashed' => ServiceCategory::onlyTrashed()->count(),
        ];
    }

  /**
   * 新しいサービスカテゴリを作成
   */
  public function createServiceCategory(array $data): ServiceCategory
  {
    return DB::transaction(function () use ($data) {
      return $this->repository->create($data);
    });
  }

  /**
   * サービスカテゴリを更新
   */
  public function updateServiceCategory(ServiceCategory $serviceCategory, array $data): ServiceCategory
  {
    return DB::transaction(function () use ($serviceCategory, $data) {
      return $this->repository->update($serviceCategory, $data);
    });
  }

  /**
   * サービスカテゴリを削除
   */
  public function deleteServiceCategory(ServiceCategory $serviceCategory): void
  {
    // サービスが紐づいている場合は削除を防ぐ
    if ($serviceCategory->services()->count() > 0) {
      throw new \Exception('このカテゴリにはサービスが紐づいているため削除できません。');
    }

    DB::transaction(function () use ($serviceCategory) {
      $this->repository->delete($serviceCategory);
    });
  }

  /**
   * ステータス定義を取得
   */
  public function getStatuses(): array
  {
    return [
      'active' => '稼働中',
      'inactive' => '停止中',
      'suspended' => '一時停止',
    ];
  }
}
