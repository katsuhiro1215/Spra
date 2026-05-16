<?php

namespace App\Repositories;

use App\Repositories\Contracts\SoftDeletableRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

/**
 * SoftDelete対応リポジトリ抽象クラス
 * 
 * SoftDeletesトレイトを使用するモデル用の機能を実装
 */
abstract class SoftDeletableRepository extends BaseRepository implements SoftDeletableRepositoryInterface
{
  /**
   * フィルタ条件でクエリビルダーを取得
   * 
   * @param array $filters
   * @return Builder
   */
  public function findWithFilters(array $filters): Builder
  {
    $query = $this->query();

    // SoftDeleteフィルタ
    if (!empty($filters['trashed'])) {
      $query = $this->applyTrashedFilter($query, $filters['trashed']);
    }

    // 検索
    if (!empty($filters['search'])) {
      $query = $this->buildSearchQuery($query, $filters['search']);
    }

    // ステータスフィルタ
    if (!empty($filters['status'])) {
      $query = $this->buildStatusFilter($query, $filters['status']);
    }

    return $query;
  }

  /**
   * 削除されたレコードを復元
   * 
   * @param mixed $model
   * @return bool
   */
  public function restore(mixed $model): bool
  {
    if (method_exists($model, 'restore')) {
      return $model->restore();
    }

    return false;
  }

  /**
   * レコードを完全削除
   * 
   * @param mixed $model
   * @return bool
   */
  public function forceDelete(mixed $model): bool
  {
    if (method_exists($model, 'forceDelete')) {
      return $model->forceDelete();
    }

    return false;
  }

  /**
   * 削除済みレコードフィルタを適用
   * 
   * @param Builder $query
   * @param string|null $trashed
   * @return Builder
   */
  public function applyTrashedFilter(Builder $query, ?string $trashed): Builder
  {
    return match ($trashed) {
      'only_trashed' => $query->onlyTrashed(),
      'with_trashed' => $query->withTrashed(),
      default => $query, // 'without_trashed' または null
    };
  }

  /**
   * 削除状態別の統計情報を取得
   * 
   * @return array
   */
  public function getTrashedStats(): array
  {
    $modelClass = $this->getModelClass();

    return [
      'total' => $modelClass::withTrashed()->count(),
      'active' => $modelClass::count(),
      'trashed' => $modelClass::onlyTrashed()->count(),
    ];
  }

  /**
   * 統計情報を取得（オーバーライド）
   * 
   * @return array
   */
  public function getStats(): array
  {
    return $this->getTrashedStats();
  }
}
