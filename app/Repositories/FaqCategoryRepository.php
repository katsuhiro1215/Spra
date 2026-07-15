<?php

namespace App\Repositories;

use App\Models\FaqCategory;
use Illuminate\Database\Eloquent\Builder;

class FaqCategoryRepository extends SoftDeletableRepository
{
    protected function getModelClass(): string
    {
        return FaqCategory::class;
    }

    protected function getSearchableFields(): array
    {
        return ['name', 'slug', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['name', 'sort_order', 'created_at'];
    }

    protected function getDefaultSortField(): string
    {
        return 'sort_order';
    }

    public function query(): Builder
    {
        return parent::query()->withCount('faqs');
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query;
    }

    public function getStats(): array
    {
        return [
            'total' => FaqCategory::withTrashed()->count(),
            'active' => FaqCategory::where('is_active', true)->count(),
            'inactive' => FaqCategory::where('is_active', false)->count(),
            'trashed' => FaqCategory::onlyTrashed()->count(),
        ];
    }
}
