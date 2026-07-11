<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Repositories\MenuItemRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MenuItemService extends BaseService
{
  public function __construct(MenuItemRepository $repository)
  {
    parent::__construct($repository);
  }

  protected function getEntityName(): string
  {
    return 'MenuItem';
  }

  public function createMenuItem(array $data): MenuItem
  {
    return DB::transaction(function () use ($data) {
      $data['created_by'] = Auth::guard('admins')->id();
      return $this->repository->create($data);
    });
  }

  public function updateMenuItem(MenuItem $menuItem, array $data): MenuItem
  {
    return DB::transaction(function () use ($menuItem, $data) {
      $data['updated_by'] = Auth::guard('admins')->id();
      return $this->repository->update($menuItem, $data);
    });
  }

  public function deleteMenuItem(MenuItem $menuItem): bool
  {
    return DB::transaction(function () use ($menuItem) {
      // 子アイテムがある場合は削除不可
      if ($menuItem->children()->count() > 0) {
        throw new \Exception('子メニューアイテムが存在するため削除できません。');
      }
      return $this->repository->delete($menuItem);
    });
  }

  public function restoreMenuItem(MenuItem $menuItem): bool
  {
    return $this->repository->restore($menuItem);
  }

  public function getStatsByMenu(string $menuId): array
  {
    return $this->repository->getStats($menuId);
  }
}
