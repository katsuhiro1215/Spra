<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * プロジェクトリポジトリインターフェース
 *
 * SoftDeletableRepositoryInterfaceを継承し、Project固有のメソッドを追加
 */
interface ProjectRepositoryInterface extends SoftDeletableRepositoryInterface
{
    public function findByIdForClient(string $id, string $userId): ?Project;
    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function syncCategories(Project $project, array $categoryIds): void;
    public function getActiveByUser(string $userId): Collection;
}
