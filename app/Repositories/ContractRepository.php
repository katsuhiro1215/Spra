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
        return Contract::with(['project', 'user', 'company', 'documents', 'invoices', 'histories', 'signatures'])->find($id);
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

    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
    {
        $query = $this->findWithFilters($filters);
        $query = $this->applySorting(
            $query,
            $sort['field'] ?? 'created_at',
            $sort['direction'] ?? 'desc'
        );

        return $query->paginate($perPage)->withQueryString();
    }

    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
    {
        $query = Contract::where('user_id', $userId)
            ->whereNotIn('status', ['draft'])
            ->with(['project', 'documents', 'invoices']);

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

        return $this->applySorting(
            $query,
            $sort['field'] ?? 'created_at',
            $sort['direction'] ?? 'desc'
        )->paginate($perPage)->withQueryString();
    }

    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('contract_number', 'like', "%{$search}%");
        });
    }

    public function buildStatusFilter(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder
    {
        $allowed = ['created_at', 'title', 'contract_number', 'status', 'end_date'];
        $field = in_array($field, $allowed) ? $field : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($field, $direction);
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

    public function delete(Contract $contract): bool
    {
        return $contract->delete();
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

    public function getStats(): array
    {
        return [
            'total' => Contract::count(),
            'active' => Contract::where('status', 'active')->count(),
            'pending' => Contract::where('status', 'pending_signature')->count(),
            'completed' => Contract::where('status', 'completed')->count(),
            'draft' => Contract::where('status', 'draft')->count(),
            'suspended' => Contract::where('status', 'suspended')->count(),
            'cancelled' => Contract::where('status', 'cancelled')->count(),
            'total_amount' => Contract::whereIn('status', ['active', 'pending_signature'])->sum('amount'),
        ];
    }
}
