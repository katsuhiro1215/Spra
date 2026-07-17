<?php

namespace App\Repositories;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Builder;

class CampaignRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   */
  protected function getModelClass(): string
  {
    return Campaign::class;
  }

  /**
   * 検索対象フィールドを返す
   */
  protected function getSearchableFields(): array
  {
    return [
      'name',
      'code',
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
      'starts_at',
      'ends_at',
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

    // 有効フラグフィルター
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
    $now = now();

    return [
      'total' => Campaign::count(),
      'running' => Campaign::currentlyRunning()->count(),
      'upcoming' => Campaign::where('is_active', true)->where('starts_at', '>', $now)->count(),
      'ended' => Campaign::where('ends_at', '<', $now)->count(),
    ];
  }
}
