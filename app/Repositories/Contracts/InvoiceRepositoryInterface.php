<?php

namespace App\Repositories\Contracts;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * 請求書リポジトリインターフェース
 *
 * SoftDeletableRepositoryInterfaceを継承し、Invoice固有のメソッドを追加
 */
interface InvoiceRepositoryInterface extends SoftDeletableRepositoryInterface
{
    public function findByIdForClient(string $id, string $userId): ?Invoice;
    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function getUnpaidByUser(string $userId): Collection;
    public function getOverdueInvoices(): Collection;
}
