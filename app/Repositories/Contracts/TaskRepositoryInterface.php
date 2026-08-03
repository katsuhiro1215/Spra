<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface TaskRepositoryInterface extends BaseRepositoryInterface
{
    public function findTodayForAdmin(string $adminId): Collection;

    public function findAssignedTo(string $adminId, int $limit = 10): Collection;

    public function findForBoard(array $filters): Collection;
}
