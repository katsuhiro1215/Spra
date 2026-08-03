<?php

namespace App\Repositories;

use App\Models\TaskCategory;
use App\Repositories\Contracts\TaskCategoryRepositoryInterface;

class TaskCategoryRepository extends BaseRepository implements TaskCategoryRepositoryInterface
{
    protected function getModelClass(): string
    {
        return TaskCategory::class;
    }

    protected function getSearchableFields(): array
    {
        return ['name'];
    }

    protected function getSortableFields(): array
    {
        return ['name', 'sort_order'];
    }
}
