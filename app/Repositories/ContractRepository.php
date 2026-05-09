<?php

namespace App\Repositories;

use App\Models\Contract;
use App\Repositories\Contracts\ContractRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class ContractRepository implements ContractRepositoryInterface
{
  public function query(): Builder
  {
    return Contract::query();
  }

  public function findById(string $id): ?Contract
  {
    return Contract::with(['project', 'user', 'company', 'documents', 'invoices'])->find($id);
  }

  public function findByIdForClient(string $id, string $userId): ?Contract
  {
    return Contract::where('id', $id)
      ->where('user_id', $userId)
      ->whereNotIn('status', ['draft'])
      ->with(['project', 'documents', 'invoices'])
      ->first();
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = Contract::query()->with(['project', 'user', 'company']);

    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('contract_number', 'like', "%{$search}%");
      });
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (!empty($filters['type'])) {
      $query->where('type', $filters['type']);
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
    $query = Contract::where('user_id', $userId)
      ->whereNotIn('status', ['draft'])
      ->with(['project', 'invoices']);

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    return $query->latest()->paginate($perPage);
  }

  public function create(array $data): Contract
  {
    return Contract::create($data);
  }

  public function update(Contract $contract, array $data): Contract
  {
    $contract->update($data);
    return $contract->fresh();
  }

  public function getActiveByUser(string $userId): Collection
  {
    return Contract::where('user_id', $userId)
      ->where('status', 'active')
      ->with(['project', 'invoices'])
      ->get();
  }

  public function getExpiringContracts(int $daysAhead = 30): Collection
  {
    return Contract::where('status', 'active')
      ->where('auto_renewal', false)
      ->whereNotNull('end_date')
      ->where('end_date', '<=', Carbon::now()->addDays($daysAhead))
      ->with(['user', 'company', 'project'])
      ->get();
  }
}
