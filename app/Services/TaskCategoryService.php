<?php

namespace App\Services;

use App\Models\TaskCategory;
use App\Repositories\Contracts\TaskCategoryRepositoryInterface;

class TaskCategoryService extends BaseService
{
    public function __construct(TaskCategoryRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'TaskCategory';
    }

    public function listAll(): \Illuminate\Support\Collection
    {
        return TaskCategory::orderBy('sort_order')->orderBy('name')->get();
    }
}
