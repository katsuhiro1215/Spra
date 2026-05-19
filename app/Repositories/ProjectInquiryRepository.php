<?php

namespace App\Repositories;

use App\Models\ProjectInquiry;
use App\Repositories\Contracts\ProjectInquiryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ProjectInquiryRepository extends SoftDeletableRepository implements ProjectInquiryRepositoryInterface
{
  /**
   * モデルクラス名を返す
   * 
   * @return string
   */
  protected function getModelClass(): string
  {
    return ProjectInquiry::class;
  }

  /**
   * 検索対象フィールドを返す
   * 
   * @return array
   */
  protected function getSearchableFields(): array
  {
    return [
      'inquiry_code',
      'title',
      'summary',
    ];
  }

  /**
   * ソート可能フィールドを返す
   * 
   * @return array
   */
  protected function getSortableFields(): array
  {
    return [
      'created_at',
      'updated_at',
      'inquiry_code',
      'status',
      'desired_delivery_date',
    ];
  }

  /**
   * デフォルトのリレーション
   * 
   * @return array
   */
  protected function getDefaultRelations(): array
  {
    return [
      'user.profile',
      'company',
      'serviceCategory',
      'service',
      'servicePlan',
      'assignedAdmin.profile',
      'quote',
    ];
  }

  /**
   * デフォルトのソート条件
   * 
   * @return array
   */
  protected function getDefaultSort(): array
  {
    return ['created_at' => 'desc'];
  }
}
