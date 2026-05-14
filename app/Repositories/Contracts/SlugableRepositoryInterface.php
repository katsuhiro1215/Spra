<?php

namespace App\Repositories\Contracts;

/**
 * Slug対応リポジトリインターフェース
 * 
 * URLフレンドリーなslugを持つモデル用の機能を定義
 */
interface SlugableRepositoryInterface
{
  /**
   * slugで単一レコードを検索
   * 
   * @param string $slug
   * @return mixed|null
   */
  public function findBySlug(string $slug): mixed;

  /**
   * slugの存在確認
   * 
   * @param string $slug チェック対象のslug
   * @param string|null $excludeId 除外するレコードのID
   * @return bool
   */
  public function slugExists(string $slug, ?string $excludeId = null): bool;

  /**
   * ユニークなslugを生成
   * 
   * @param string $text 元となるテキスト
   * @param string|null $excludeId 除外するレコードのID
   * @return string
   */
  public function generateUniqueSlug(string $text, ?string $excludeId = null): string;
}
