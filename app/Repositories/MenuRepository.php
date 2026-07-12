<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Builder;

class MenuRepository extends BaseRepository
{
  protected function getModelClass(): string
  {
    return Menu::class;
  }

  protected function getSearchableFields(): array
  {
    return ['name', 'slug', 'description', 'location'];
  }

  protected function getSortableFields(): array
  {
    return ['name', 'location', 'created_at'];
  }

  protected function getDefaultRelations(): array
  {
    return ['menuItems'];
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = parent::findWithFilters($filters);

    if (!empty($filters['location'])) {
      $query->where('location', $filters['location']);
    }

    return $query;
  }

  public function getStats(): array
  {
    return [
      'total' => Menu::count(),
      'header' => Menu::where('location', 'header')->count(),
      'footer' => Menu::where('location', 'footer')->count(),
    ];
  }
}
