<?php

namespace App\Repositories;

use App\Models\OrganizationHistory;

class OrganizationHistoryRepository extends BaseRepository
{
  protected function getModelClass(): string
  {
    return OrganizationHistory::class;
  }

  protected function getSearchableFields(): array
  {
    return ['title', 'description'];
  }

  protected function getSortableFields(): array
  {
    return ['event_date', 'sort_order', 'created_at'];
  }

  protected function getDefaultSortField(): string
  {
    return 'sort_order';
  }

  public function getStats(): array
  {
    return [
      'total' => OrganizationHistory::count(),
      'published' => OrganizationHistory::where('is_published', true)->count(),
      'unpublished' => OrganizationHistory::where('is_published', false)->count(),
    ];
  }
}
