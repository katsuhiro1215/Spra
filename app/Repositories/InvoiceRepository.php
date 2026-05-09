<?php

namespace App\Repositories;

use App\Models\Invoice;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class InvoiceRepository implements InvoiceRepositoryInterface
{
  public function query(): Builder
  {
    return Invoice::query();
  }

  public function findById(string $id): ?Invoice
  {
    return Invoice::with(['contract', 'user', 'company', 'items', 'payments'])->find($id);
  }

  public function findByIdForClient(string $id, string $userId): ?Invoice
  {
    return Invoice::where('id', $id)
      ->where('user_id', $userId)
      ->whereNotIn('status', ['draft'])
      ->with(['contract', 'items', 'payments'])
      ->first();
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = Invoice::query()->with(['contract', 'user', 'company']);

    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('invoice_number', 'like', "%{$search}%")
          ->orWhere('title', 'like', "%{$search}%");
      });
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (!empty($filters['user_id'])) {
      $query->where('user_id', $filters['user_id']);
    }

    if (!empty($filters['company_id'])) {
      $query->where('company_id', $filters['company_id']);
    }

    return $query;
  }

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
  {
    return $this->findWithFilters($filters)->latest()->paginate($perPage);
  }

  public function paginateForClient(string $userId, int $perPage = 20, array $filters = []): LengthAwarePaginator
  {
    $query = Invoice::where('user_id', $userId)
      ->whereNotIn('status', ['draft'])
      ->with(['contract', 'items']);

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    return $query->latest()->paginate($perPage);
  }

  public function create(array $data): Invoice
  {
    return Invoice::create($data);
  }

  public function update(Invoice $invoice, array $data): Invoice
  {
    $invoice->update($data);
    return $invoice->fresh();
  }

  public function getUnpaidByUser(string $userId): Collection
  {
    return Invoice::where('user_id', $userId)
      ->unpaid()
      ->with(['contract', 'items'])
      ->get();
  }

  public function getOverdueInvoices(): Collection
  {
    return Invoice::whereIn('status', ['sent', 'overdue'])
      ->where('due_date', '<', Carbon::today())
      ->with(['user', 'company', 'contract'])
      ->get();
  }
}
