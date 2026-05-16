<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

/**
 * ステータス管理対応リポジトリインターフェース
 * 
 * statusカラムを持つモデル用の機能を定義
 */
interface StatusableRepositoryInterface
{
  /**
   * 指定ステータスのレコードを取得
   * 
   * @param string $status
   * @return Collection
   */
  public function getByStatus(string $status): Collection;

  /**
   * アクティブなレコードを取得
   * 
   * @return Collection
   */
  public function getActiveRecords(): Collection;

  /**
   * 非アクティブなレコードを取得
   * 
   * @return Collection
   */
  public function getInactiveRecords(): Collection;

  /**
   * レコードのステータスを更新
   * 
   * @param mixed $model 更新対象モデル
   * @param string $status 新しいステータス
   * @return bool
   */
  public function updateStatus(mixed $model, string $status): bool;

  /**
   * ステータス別の統計情報を取得
   * 
   * @return array ['active' => int, 'inactive' => int, 'suspended' => int, ...]
   */
  public function getStatusStats(): array;
}
