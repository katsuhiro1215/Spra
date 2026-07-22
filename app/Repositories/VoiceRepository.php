<?php

namespace App\Repositories;

use App\Models\Voice;
use Illuminate\Database\Eloquent\Builder;

class VoiceRepository extends SoftDeletableRepository
{
    protected function getModelClass(): string
    {
        return Voice::class;
    }

    protected function getSearchableFields(): array
    {
        return ['author_name', 'company_name', 'content'];
    }

    protected function getSortableFields(): array
    {
        return ['author_name', 'sort_order', 'rating', 'created_at', 'updated_at'];
    }

    protected function getDefaultSortField(): string
    {
        return 'sort_order';
    }

    protected function getDefaultRelations(): array
    {
        return ['service', 'user', 'avatar'];
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

        if (!empty($filters['service_id'])) {
            $query->where('service_id', $filters['service_id']);
        }

        if (isset($filters['is_published']) && $filters['is_published'] !== '') {
            $query->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_featured']) && $filters['is_featured'] !== '') {
            $query->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query;
    }

    public function getStats(): array
    {
        return [
            'total' => Voice::withTrashed()->count(),
            'active' => Voice::count(),
            'published' => Voice::where('is_published', true)->count(),
            'draft' => Voice::where('is_published', false)->count(),
            'trashed' => Voice::onlyTrashed()->count(),
        ];
    }
}
