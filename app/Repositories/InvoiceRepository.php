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
    return Invoice::with(['contract', 'user', 'company', 'payments'])->find($id);
  }

  public function findByIdForClient(string $id, string $userId): ?Invoice
  {
    return Invoice::where('id', $id)
      ->where('user_id', $userId)
      ->whereNotIn('status', ['draft'])
      ->with(['contract', 'payments'])
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

  public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
  {
    $query = $this->findWithFilters($filters);

    // ソート処理
    if (!empty($sort['column']) && !empty($sort['direction'])) {
      $query->orderBy($sort['column'], $sort['direction']);
    } else {
      $query->latest();
    }

    return $query->paginate($perPage);
  }

  public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
  {
    $query = Invoice::where('user_id', $userId)
      ->whereNotIn('status', ['draft'])
      ->with(['contract']);

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    // ソート処理
    if (!empty($sort['column']) && !empty($sort['direction'])) {
      $query->orderBy($sort['column'], $sort['direction']);
    } else {
      $query->latest();
    }

    return $query->paginate($perPage);
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
      ->with(['contract'])
      ->get();
  }

  public function getOverdueInvoices(): Collection
  {
    return Invoice::whereIn('status', ['sent', 'overdue'])
      ->where('due_date', '<', Carbon::today())
      ->with(['user', 'company', 'contract'])
      ->get();
  }

  public function buildSearchQuery(Builder $query, string $search): Builder
  {
    return $query->where(function ($q) use ($search) {
      $q->where('invoice_number', 'like', "%{$search}%")
        ->orWhereHas('user', function ($q) use ($search) {
          $q->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%");
        })
        ->orWhereHas('company', function ($q) use ($search) {
          $q->where('name', 'like', "%{$search}%");
        });
    });
  }

  public function buildStatusFilter(Builder $query, string $status): Builder
  {
    return $query->where('status', $status);
  }

  public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder
  {
    return $query->orderBy($field, $direction);
  }

  public function delete(Invoice $invoice): bool
  {
    return $invoice->delete();
  }

  public function getStats(): array
  {
    return [
      'total' => Invoice::count(),
      'draft' => Invoice::where('status', 'draft')->count(),
      'sent' => Invoice::where('status', 'sent')->count(),
      'paid' => Invoice::where('status', 'paid')->count(),
      'overdue' => Invoice::where('status', 'overdue')->count(),
      'total_amount' => Invoice::where('status', 'paid')->sum('total_amount'),
    ];
  }
}
