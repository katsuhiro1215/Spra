<?php

namespace App\Repositories;

use App\Models\Technology;
use App\Repositories\Contracts\TechnologyRepositoryInterface;

class TechnologyRepository extends SoftDeletableRepository implements TechnologyRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Technology::class;
    }

    protected function getSearchableFields(): array
    {
        return ['name', 'slug'];
    }

    protected function getSortableFields(): array
    {
        return ['name', 'sort_order', 'created_at', 'updated_at'];
    }
}
