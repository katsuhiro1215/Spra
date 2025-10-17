<?php

namespace App\Services;

use App\Models\ServiceType;
use App\Models\ServiceCategory;
use App\Repositories\ServiceTypeRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceTypeService
{
  public function __construct(
    private ServiceTypeRepository $repository
  ) {}

  /**
   * ページネーション付きでサービスタイプを取得
   */
  public function getPaginatedServiceTypes(array $filters, array $sort, int $perPage = 20): LengthAwarePaginator
  {
    $query = $this->repository->findWithFilters($filters);

    // ソートを適用
    $sortField = $sort['field'] ?? 'sort_order';
    $sortDirection = $sort['direction'] ?? 'asc';
    $query = $this->repository->applySorting($query, $sortField, $sortDirection);

    return $query->paginate($perPage)->withQueryString();
  }

  /**
   * アクティブなサービスカテゴリを取得
   */
  public function getActiveServiceCategories(): \Illuminate\Database\Eloquent\Collection
  {
    return ServiceCategory::active()
      ->orderBy('sort_order')
      ->get(['id', 'name']);
  }

  /**
   * 料金体系の選択肢を取得
   */
  public function getPricingModels(): array
  {
    return [
      'fixed' => '固定価格',
      'subscription' => 'サブスクリプション',
      'custom' => 'カスタム価格',
      'hybrid' => 'ハイブリッド'
    ];
  }

  /**
   * 新しいサービスタイプを作成
   */
  public function createServiceType(array $data): ServiceType
  {
    return DB::transaction(function () use ($data) {
      // デフォルト値の設定
      $data = $this->setDefaultValues($data);

      // 作成者情報の追加
      $data['created_by'] = Auth::guard('admins')->id();

      return ServiceType::create($data);
    });
  }

  /**
   * サービスタイプを更新
   */
  public function updateServiceType(ServiceType $serviceType, array $data): ServiceType
  {
    return DB::transaction(function () use ($serviceType, $data) {
      // 更新者情報の追加
      $data['updated_by'] = Auth::guard('admins')->id();

      $serviceType->update($data);

      return $serviceType->fresh();
    });
  }

  /**
   * サービスタイプを削除
   */
  public function deleteServiceType(ServiceType $serviceType): bool
  {
    return DB::transaction(function () use ($serviceType) {
      // 子サービスがある場合は削除不可
      if ($serviceType->childServices()->count() > 0) {
        throw new \Exception('子サービスが存在するため削除できません。');
      }

      return $serviceType->delete();
    });
  }

  /**
   * サービスタイプを複製
   */
  public function duplicateServiceType(ServiceType $originalServiceType): ServiceType
  {
    return DB::transaction(function () use ($originalServiceType) {
      $data = $originalServiceType->toArray();

      // 複製時に除外するフィールド
      unset($data['id'], $data['created_at'], $data['updated_at']);

      // 名前とスラッグを調整
      $data['name'] = $data['name'] . ' (コピー)';
      $data['slug'] = $data['slug'] ? $data['slug'] . '-copy-' . time() : null;

      // 作成者情報の設定
      $data['created_by'] = Auth::guard('admins')->id();
      $data['updated_by'] = null;

      return ServiceType::create($data);
    });
  }

  /**
   * 一括操作（Repository層を使用）
   */
  public function bulkAction(array $ids, string $action): int
  {
    return DB::transaction(function () use ($ids, $action) {
      $updateData = ['updated_by' => Auth::guard('admins')->id()];

      return match ($action) {
        'activate' => $this->repository->bulkUpdate($ids, array_merge($updateData, ['is_active' => true])),
        'deactivate' => $this->repository->bulkUpdate($ids, array_merge($updateData, ['is_active' => false])),
        'feature' => $this->repository->bulkUpdate($ids, array_merge($updateData, ['is_featured' => true])),
        'unfeature' => $this->repository->bulkUpdate($ids, array_merge($updateData, ['is_featured' => false])),
        'delete' => $this->repository->bulkDelete($ids),
        default => 0
      };
    });
  }

  /**
   * 表示順序を更新（Repository層を使用）
   */
  public function updateOrder(array $orders): bool
  {
    return DB::transaction(function () use ($orders) {
      foreach ($orders as $order) {
        $this->repository->bulkUpdate(
          [$order['id']],
          [
            'sort_order' => $order['sort_order'],
            'updated_by' => Auth::guard('admins')->id()
          ]
        );
      }
      return true;
    });
  }

  /**
   * デフォルト値を設定
   */
  private function setDefaultValues(array $data): array
  {
    // 表示順序のデフォルト値
    if (!isset($data['sort_order'])) {
      $data['sort_order'] = $this->repository->getMaxSortOrder() + 1;
    }

    // カラーのデフォルト値
    if (!isset($data['color']) || empty($data['color'])) {
      $data['color'] = '#3B82F6';
    }

    return $data;
  }
}
