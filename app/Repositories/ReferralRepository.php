<?php

namespace App\Repositories;

use App\Models\Referral;
use Illuminate\Database\Eloquent\Builder;

class ReferralRepository extends BaseRepository
{
  /**
   * モデルクラス名を返す
   */
  protected function getModelClass(): string
  {
    return Referral::class;
  }

  /**
   * 検索対象フィールドを返す
   */
  protected function getSearchableFields(): array
  {
    return [
      'referral_code',
      'referrerCompany.name',
      'referredCompany.name',
    ];
  }

  /**
   * ソート可能フィールドを返す
   */
  protected function getSortableFields(): array
  {
    return [
      'referral_code',
      'status',
      'created_at',
    ];
  }

  /**
   * デフォルトのリレーションを返す
   */
  protected function getDefaultRelations(): array
  {
    return ['referrerCompany', 'referredCompany'];
  }

  /**
   * フィルタ条件でクエリビルダーを取得
   */
  public function findWithFilters(array $filters): Builder
  {
    $query = parent::findWithFilters($filters);

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    return $query;
  }

  /**
   * 統計情報を取得
   */
  public function getStats(): array
  {
    return [
      'total' => Referral::count(),
      'pending' => Referral::where('status', 'pending')->count(),
      'contracted' => Referral::where('status', 'contracted')->count(),
    ];
  }
}
