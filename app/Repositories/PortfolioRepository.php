<?php

namespace App\Repositories;

use App\Models\Portfolio;
use App\Repositories\Contracts\PortfolioRepositoryInterface;

class PortfolioRepository extends SoftDeletableRepository implements PortfolioRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Portfolio::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['title', 'completed_at', 'sort_order', 'created_at', 'updated_at'];
    }
}
