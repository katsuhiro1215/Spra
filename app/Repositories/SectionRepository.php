<?php

namespace App\Repositories;

use App\Models\Section;
use Illuminate\Database\Eloquent\Builder;

class SectionRepository extends SoftDeletableRepository
{
  protected function getModelClass(): string
  {
    return Section::class;
  }

  protected function getSearchableFields(): array
  {
    return ['name', 'role'];
  }

  protected function getSortableFields(): array
  {
    return ['name', 'sort_order', 'created_at'];
  }

  protected function getDefaultRelations(): array
  {
    return ['page'];
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = parent::findWithFilters($filters);

    if (!empty($filters['page_id'])) {
      $query->where('page_id', $filters['page_id']);
    }

    if (!empty($filters['role'])) {
      $query->where('role', $filters['role']);
    }

    return $query;
  }

  public function getStats(): array
  {
    return [
      'total' => Section::withTrashed()->count(),
      'active' => Section::count(),
      'trashed' => Section::onlyTrashed()->count(),
    ];
  }
}
