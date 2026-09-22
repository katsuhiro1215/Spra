<?php

namespace App\Repositories;

use App\Models\Proposal;
use App\Repositories\Contracts\ProposalRepositoryInterface;
use Illuminate\Support\Collection;

class ProposalRepository extends BaseRepository implements ProposalRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Proposal::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title'];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'status'];
    }

    public function findByHearing(string $hearingId): Collection
    {
        return Proposal::where('hearing_id', $hearingId)
            ->orderByDesc('created_at')
            ->get();
    }
}
