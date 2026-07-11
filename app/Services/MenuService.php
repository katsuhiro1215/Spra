<?php

namespace App\Services;

use App\Models\Menu;
use App\Repositories\MenuRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MenuService extends BaseService
{
  public function __construct(MenuRepository $repository)
  {
    parent::__construct($repository);
  }

  protected function getEntityName(): string
  {
    return 'Menu';
  }

  public function createMenu(array $data): Menu
  {
    return DB::transaction(function () use ($data) {
      $data['created_by'] = Auth::guard('admins')->id();
      return $this->repository->create($data);
    });
  }

  public function updateMenu(Menu $menu, array $data): Menu
  {
    return DB::transaction(function () use ($menu, $data) {
      $data['updated_by'] = Auth::guard('admins')->id();
      return $this->repository->update($menu, $data);
    });
  }

  public function deleteMenu(Menu $menu): bool
  {
    return DB::transaction(function () use ($menu) {
      // メニューアイテムがある場合は削除不可
      if ($menu->menuItems()->count() > 0) {
        throw new \Exception('メニューアイテムが存在するため削除できません。');
      }
      return $this->repository->delete($menu);
    });
  }
}
