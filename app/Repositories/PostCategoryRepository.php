<?php

namespace App\Repositories;

use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class PostCategoryRepository extends SoftDeletableRepository
{
    protected function getModelClass(): string
    {
        return PostCategory::class;
    }

    protected function getSearchableFields(): array
    {
        return ['name', 'slug', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['name', 'sort_order', 'created_at'];
    }

    protected function getDefaultRelations(): array
    {
        return ['parent', 'children'];
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

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

    public function getStats(): array
    {
        return [
            'total' => PostCategory::withTrashed()->count(),
            'active' => PostCategory::where('is_active', true)->count(),
            'inactive' => PostCategory::where('is_active', false)->count(),
            'trashed' => PostCategory::onlyTrashed()->count(),
        ];
    }

    public function getAllHierarchical(): Collection
    {
        return PostCategory::with('children')
            ->whereNull('parent_id')
            ->ordered()
            ->get();
    }
}
