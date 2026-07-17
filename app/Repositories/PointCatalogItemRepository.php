<?php

namespace App\Repositories;

use App\Models\PointCatalogItem;
use Illuminate\Database\Eloquent\Builder;

class PointCatalogItemRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   */
  protected function getModelClass(): string
  {
    return PointCatalogItem::class;
  }

  /**
   * 検索対象フィールドを返す
   */
  protected function getSearchableFields(): array
  {
    return [
      'name',
      'description',
    ];
  }

  /**
   * ソート可能フィールドを返す
   */
  protected function getSortableFields(): array
  {
    return [
      'name',
      'points_cost',
      'sort_order',
      'created_at',
    ];
  }

  /**
   * デフォルトのソートフィールドを返す
   */
  protected function getDefaultSortField(): string
  {
    return 'sort_order';
  }

  /**
   * デフォルトのリレーションを返す
   */
  protected function getDefaultRelations(): array
  {
    return [];
  }

  /**
   * フィルタ条件でクエリビルダーを取得
   */
  public function findWithFilters(array $filters): Builder
  {
    $query = parent::findWithFilters($filters);

    if (isset($filters['is_active'])) {
      $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
    }

    return $query;
  }

  /**
   * 統計情報を取得
   */
  public function getStats(): array
  {
    return [
      'total' => PointCatalogItem::count(),
      'active' => PointCatalogItem::where('is_active', true)->count(),
    ];
  }
}
