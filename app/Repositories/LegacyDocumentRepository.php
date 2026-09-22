<?php

namespace App\Repositories;

use App\Models\LegacyDocument;
use App\Repositories\Contracts\LegacyDocumentRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class LegacyDocumentRepository extends BaseRepository implements LegacyDocumentRepositoryInterface
{
    protected function getModelClass(): string
    {
        return LegacyDocument::class;
    }

    protected function getSearchableFields(): array
    {
        return ['client_name', 'notes'];
    }

    protected function getSortableFields(): array
    {
        return ['issued_at', 'total_amount', 'created_at'];
    }

    /**
     * legacy_documents には status カラムが無いため、BaseRepository の
     * status フィルタは適用せず、document_type の完全一致フィルタのみ追加する。
     */
    public function findWithFilters(array $filters): Builder
    {
        $query = $this->query();

        if (!empty($filters['search'])) {
            $query = $this->buildSearchQuery($query, $filters['search']);
        }

        if (!empty($filters['document_type']) && in_array($filters['document_type'], LegacyDocument::DOCUMENT_TYPES, true)) {
            $query = $query->where('document_type', $filters['document_type']);
        }

        return $query;
    }
}
