<?php

namespace App\Repositories\Contracts;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface InvoiceRepositoryInterface
{
  public function query(): Builder;

  public function findById(string $id): ?Invoice;

  public function findByIdForClient(string $id, string $userId): ?Invoice;

  public function findWithFilters(array $filters): Builder;

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function paginateForClient(string $userId, int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function create(array $data): Invoice;

  public function update(Invoice $invoice, array $data): Invoice;

  public function getUnpaidByUser(string $userId): Collection;

  public function getOverdueInvoices(): Collection;
}
