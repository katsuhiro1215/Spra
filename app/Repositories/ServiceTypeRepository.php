<?php

namespace App\Repositories;

use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ServiceTypeRepository
{
  /**
   * 基本的なクエリビルダーを取得
   */
  public function query(): Builder
  {
    return ServiceType::query();
  }

  /**
   * リレーションを含むクエリを取得
   */
  public function queryWithRelations(): Builder
  {
    return ServiceType::with(['serviceCategory', 'createdBy', 'updatedBy', 'parentService', 'childServices']);
  }

  /**
   * 検索条件を適用したクエリを取得
   */
  public function buildSearchQuery(Builder $query, string $search): Builder
  {
    return $query->where(function ($q) use ($search) {
      $q->where('name', 'like', '%' . $search . '%')
        ->orWhere('description', 'like', '%' . $search . '%')
        ->orWhere('detailed_description', 'like', '%' . $search . '%')
        ->orWhere('product_name', 'like', '%' . $search . '%');
    });
  }

  /**
   * カテゴリフィルターを適用
   */
  public function buildCategoryFilter(Builder $query, int $categoryId): Builder
  {
    return $query->where('service_category_id', $categoryId);
  }

  /**
   * 料金体系フィルターを適用
   */
  public function buildPricingModelFilter(Builder $query, string $pricingModel): Builder
  {
    return $query->where('pricing_model', $pricingModel);
  }

  /**
   * ステータスフィルターを適用
   */
  public function buildStatusFilter(Builder $query, string $status): Builder
  {
    return match ($status) {
      'active' => $query->where('is_active', true),
      'inactive' => $query->where('is_active', false),
      'featured' => $query->where('is_featured', true),
      default => $query
    };
  }

  /**
   * ソートを適用
   */
  public function applySorting(Builder $query, string $field, string $direction): Builder
  {
    $allowedSortFields = ['name', 'created_at', 'updated_at', 'sort_order', 'base_price'];

    if (in_array($field, $allowedSortFields)) {
      return $query->orderBy($field, $direction);
    }

    return $query->orderBy('sort_order', 'asc');
  }

  /**
   * 複数条件でのフィルタリング（Fluent Interface）
   */
  public function findWithFilters(array $filters): Builder
  {
    $query = $this->queryWithRelations();

    if (!empty($filters['search'])) {
      $query = $this->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['category_id'])) {
      $query = $this->buildCategoryFilter($query, $filters['category_id']);
    }

    if (!empty($filters['pricing_model'])) {
      $query = $this->buildPricingModelFilter($query, $filters['pricing_model']);
    }

    if (!empty($filters['status'])) {
      $query = $this->buildStatusFilter($query, $filters['status']);
    }

    return $query;
  }

  /**
   * アクティブなサービスタイプを取得
   */
  public function findActive(): Collection
  {
    return ServiceType::where('is_active', true)
      ->orderBy('sort_order')
      ->get();
  }

  /**
   * おすすめサービスタイプを取得
   */
  public function findFeatured(int $limit = null): Collection
  {
    $query = ServiceType::where('is_featured', true)
      ->where('is_active', true)
      ->orderBy('sort_order');

    if ($limit) {
      $query->limit($limit);
    }

    return $query->get();
  }

  /**
   * カテゴリ別のサービスタイプを取得
   */
  public function findByCategory(int $categoryId): Collection
  {
    return ServiceType::where('service_category_id', $categoryId)
      ->where('is_active', true)
      ->orderBy('sort_order')
      ->get();
  }

  /**
   * 親サービスを持たないトップレベルサービスを取得
   */
  public function findTopLevel(): Collection
  {
    return ServiceType::whereNull('parent_service_id')
      ->where('is_active', true)
      ->orderBy('sort_order')
      ->get();
  }

  /**
   * 子サービスを取得
   */
  public function findChildren(int $parentId): Collection
  {
    return ServiceType::where('parent_service_id', $parentId)
      ->where('is_active', true)
      ->orderBy('sort_order')
      ->get();
  }

  /**
   * 最大ソート順序を取得
   */
  public function getMaxSortOrder(): int
  {
    return ServiceType::max('sort_order') ?? 0;
  }

  /**
   * スラッグの重複チェック
   */
  public function isSlugUnique(string $slug, ?int $excludeId = null): bool
  {
    $query = ServiceType::where('slug', $slug);

    if ($excludeId) {
      $query->where('id', '!=', $excludeId);
    }

    return !$query->exists();
  }

  /**
   * 一括更新（効率的な更新）
   */
  public function bulkUpdate(array $ids, array $data): int
  {
    return ServiceType::whereIn('id', $ids)->update($data);
  }

  /**
   * 一括削除
   */
  public function bulkDelete(array $ids): int
  {
    return ServiceType::whereIn('id', $ids)->delete();
  }
}
