<?php

namespace App\Services;

use App\Models\PageType;
use App\Repositories\PageTypeRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PageTypeService extends BaseService
{
  /**
   * コンストラクタ
   */
  public function __construct(PageTypeRepository $repository)
  {
    parent::__construct($repository);
  }

  /**
   * エンティティ名を返す
   */
  protected function getEntityName(): string
  {
    return 'PageType';
  }

  /**
   * ページタイプを作成
   */
  public function createPageType(array $data): PageType
  {
    return DB::transaction(function () use ($data) {
      $data['created_by'] = Auth::guard('admins')->id();
      return $this->repository->create($data);
    });
  }

  /**
   * ページタイプを更新
   */
  public function updatePageType(PageType $pageType, array $data): PageType
  {
    return DB::transaction(function () use ($pageType, $data) {
      $data['updated_by'] = Auth::guard('admins')->id();
      return $this->repository->update($pageType, $data);
    });
  }

  /**
   * ページタイプを削除
   */
  public function deletePageType(PageType $pageType): bool
  {
    // システムページタイプは削除できない
    if ($pageType->is_system) {
      throw new \Exception('システムページタイプは削除できません。');
    }

    return DB::transaction(function () use ($pageType) {
      return $this->repository->delete($pageType);
    });
  }
}
