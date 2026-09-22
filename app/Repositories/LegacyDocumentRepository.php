<?php

namespace App\Repositories;

use App\Models\LegacyDocument;
use App\Repositories\Contracts\LegacyDocumentRepositoryInterface;

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
}
