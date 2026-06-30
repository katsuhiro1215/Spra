<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface
{
    public function query(): Builder;
    public function findByIdForClient(string $id, string $userId): ?Project;
    public function syncCategories(Project $project, array $categoryIds): void;
    public function getActiveByUser(string $userId): Collection;
}
