<?php

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface extends BaseRepositoryInterface
{
    public function findTodayForAdmin(string $adminId): Collection;

    public function findAssignedTo(string $adminId, int $limit = 10): Collection;

    public function findForBoard(array $filters): Collection;

    public function countCompletedByMonth(array $filters): Collection;

    public function paginateCompletedInMonth(string $month, array $filters, int $perPage = 50): LengthAwarePaginator;
}
