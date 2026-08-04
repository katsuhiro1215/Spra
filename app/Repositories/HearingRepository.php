<?php

namespace App\Repositories;

use App\Models\Hearing;
use App\Repositories\Contracts\HearingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class HearingRepository extends SoftDeletableRepository implements HearingRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Hearing::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title', 'notes'];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'updated_at', 'title'];
    }

    protected function getDefaultRelations(): array
    {
        return ['contact', 'quote', 'creator'];
    }

    public function getByContact(string $contactId): Collection
    {
        return Hearing::where('contact_id', $contactId)
            ->with($this->getDefaultRelations())
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
