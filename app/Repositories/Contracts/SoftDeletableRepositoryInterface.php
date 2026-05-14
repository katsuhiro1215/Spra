<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Builder;

/**
 * SoftDelete対応リポジトリインターフェース
 * 
 * SoftDeletesトレイトを使用するモデル用の追加機能を定義
 */
interface SoftDeletableRepositoryInterface extends BaseRepositoryInterface
{
  /**
   * 削除されたレコードを復元
   * 
   * @param mixed $model 復元対象モデル
   * @return bool
   */
  public function restore(mixed $model): bool;

  /**
   * レコードを完全削除
   * 
   * @param mixed $model 削除対象モデル
   * @return bool
   */
  public function forceDelete(mixed $model): bool;

  /**
   * 削除済みレコードフィルタを適用
   * 
   * @param Builder $query
   * @param string|null $trashed フィルタ値 (with_trashed | only_trashed | without_trashed)
   * @return Builder
   */
  public function applyTrashedFilter(Builder $query, ?string $trashed): Builder;

  /**
   * 削除状態別の統計情報を取得
   * 
   * @return array ['total' => int, 'active' => int, 'trashed' => int]
   */
  public function getTrashedStats(): array;
}
