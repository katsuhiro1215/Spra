<?php

namespace App\Repositories;

use App\Models\MembershipRank;
use Illuminate\Database\Eloquent\Builder;

class MembershipRankRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   */
  protected function getModelClass(): string
  {
    return MembershipRank::class;
  }

  /**
   * 検索対象フィールドを返す
   */
  protected function getSearchableFields(): array
  {
    return [
      'key',
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
      'min_annual_amount',
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
      'total' => MembershipRank::count(),
      'active' => MembershipRank::where('is_active', true)->count(),
    ];
  }
}
