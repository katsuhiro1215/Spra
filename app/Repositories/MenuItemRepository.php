<?php

namespace App\Repositories;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Builder;

class MenuItemRepository extends SoftDeletableRepository
{
  protected function getModelClass(): string
  {
    return MenuItem::class;
  }

  protected function getSearchableFields(): array
  {
    return ['label', 'url'];
  }

  protected function getSortableFields(): array
  {
    return ['label', 'sort_order', 'created_at'];
  }

  protected function getDefaultRelations(): array
  {
    return ['page', 'parent', 'children'];
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = parent::findWithFilters($filters);

    if (!empty($filters['menu_id'])) {
      $query->where('menu_id', $filters['menu_id']);
    }

    if (isset($filters['parent_id'])) {
      if ($filters['parent_id'] === 'null') {
        $query->whereNull('parent_id');
      } else {
        $query->where('parent_id', $filters['parent_id']);
      }
    }

    if (isset($filters['is_active'])) {
      $query->where('is_active', $filters['is_active']);
    }

    return $query;
  }

  public function getStats(string $menuId): array
  {
    return [
      'total' => MenuItem::where('menu_id', $menuId)->withTrashed()->count(),
      'active' => MenuItem::where('menu_id', $menuId)->where('is_active', true)->count(),
      'inactive' => MenuItem::where('menu_id', $menuId)->where('is_active', false)->count(),
      'trashed' => MenuItem::where('menu_id', $menuId)->onlyTrashed()->count(),
    ];
  }
}
