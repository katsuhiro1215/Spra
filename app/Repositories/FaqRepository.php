<?php

namespace App\Repositories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Builder;

class FaqRepository extends SoftDeletableRepository
{
    protected function getModelClass(): string
    {
        return Faq::class;
    }

    protected function getSearchableFields(): array
    {
        return ['question', 'answer'];
    }

    protected function getSortableFields(): array
    {
        return ['question', 'sort_order', 'created_at', 'updated_at'];
    }

    protected function getDefaultSortField(): string
    {
        return 'sort_order';
    }

    protected function getDefaultRelations(): array
    {
        return ['faqCategory'];
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

        if (!empty($filters['faq_category_id'])) {
            $query->where('faq_category_id', $filters['faq_category_id']);
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
            'total' => Faq::withTrashed()->count(),
            'active' => Faq::count(),
            'published' => Faq::where('is_published', true)->count(),
            'draft' => Faq::where('is_published', false)->count(),
            'trashed' => Faq::onlyTrashed()->count(),
        ];
    }
}
