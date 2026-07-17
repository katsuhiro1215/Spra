<?php

namespace App\Repositories;

use App\Models\PointReward;
use Illuminate\Database\Eloquent\Builder;

class PointRewardRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   */
  protected function getModelClass(): string
  {
    return PointReward::class;
  }

  /**
   * 検索対象フィールドを返す
   */
  protected function getSearchableFields(): array
  {
    return [
      'code',
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
      'code',
      'name',
      'points',
      'created_at',
    ];
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
      'total' => PointReward::count(),
      'active' => PointReward::where('is_active', true)->count(),
    ];
  }
}
