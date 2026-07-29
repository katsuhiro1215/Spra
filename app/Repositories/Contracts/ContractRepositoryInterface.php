<?php

namespace App\Repositories\Contracts;

use App\Models\Contract;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * 契約リポジトリインターフェース
 *
 * SoftDeletableRepositoryInterfaceを継承し、Contract固有のメソッドを追加
 */
interface ContractRepositoryInterface extends SoftDeletableRepositoryInterface
{
    public function findByIdForClient(string $id, string $userId): ?Contract;
    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function generateContractNumber(): string;
    public function getActiveByUser(string $userId): Collection;
    public function getByUserAndStatus(string $userId, string $status): Collection;
    public function getExpiringContracts(int $daysAhead = 30): Collection;
}
