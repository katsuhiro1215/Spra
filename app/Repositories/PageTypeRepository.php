<?php

namespace App\Repositories;

use App\Models\PageType;
use Illuminate\Database\Eloquent\Builder;

class PageTypeRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   */
  protected function getModelClass(): string
  {
    return PageType::class;
  }

  /**
   * 検索対象フィールドを返す
   */
  protected function getSearchableFields(): array
  {
    return [
      'name',
      'slug',
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
      'slug',
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

    // システムページタイプフィルター
    if (isset($filters['is_system'])) {
      $query->where('is_system', filter_var($filters['is_system'], FILTER_VALIDATE_BOOLEAN));
    }

    // 動的ページフィルター
    if (isset($filters['is_dynamic'])) {
      $query->where('is_dynamic', filter_var($filters['is_dynamic'], FILTER_VALIDATE_BOOLEAN));
    }

    return $query;
  }

  /**
   * 統計情報を取得
   */
  public function getStats(): array
  {
    return [
      'total' => PageType::count(),
      'system' => PageType::where('is_system', true)->count(),
      'custom' => PageType::where('is_system', false)->count(),
      'dynamic' => PageType::where('is_dynamic', true)->count(),
    ];
  }
}
