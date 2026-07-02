<?php

namespace App\Repositories;

use App\Models\QuoteResponse;

class QuoteResponseRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   *
   * @return string
   */
  protected function getModelClass(): string
  {
    return QuoteResponse::class;
  }

  /**
   * 検索対象フィールドを返す
   *
   * @return array
   */
  protected function getSearchableFields(): array
  {
    return ['email', 'response_text'];
  }

  /**
   * ソート可能フィールドを返す
   *
   * @return array
   */
  protected function getSortableFields(): array
  {
    return ['created_at', 'responded_at', 'email'];
  }

  /**
   * デフォルトのリレーションを返す
   *
   * @return array
   */
  protected function getDefaultRelations(): array
  {
    return ['quote', 'user', 'company'];
  }

  /**
   * クエリビルダーを取得
   *
   * @return \Illuminate\Database\Eloquent\Builder
   */
  public function getQuery()
  {
    return $this->query();
  }
}
