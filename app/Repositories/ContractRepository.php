<?php

namespace App\Repositories;

use App\Models\Contract;
use App\Models\ContractVersion;
use App\Repositories\Contracts\ContractRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class ContractRepository extends SoftDeletableRepository implements ContractRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Contract::class;
    }

    protected function getSearchableFields(): array
    {
        return [
            'title',
            'contract_number',
        ];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'title', 'contract_number', 'status', 'end_date'];
    }

    protected function getDefaultRelations(): array
    {
        return ['user.profile', 'company', 'project', 'currentVersion'];
    }

    /**
     * 詳細画面向けに全関連データを読み込んで取得する（一覧用のgetDefaultRelations()より重いため個別実装）
     */
    public function findById(string $id): mixed
    {
        return Contract::with([
            'user.profile',
            'billingUser.profile',
            'company.users.profile',
            'quote',
            'project',
            'contractGroup',
            'currentVersion.items.serviceItem',
            'versions' => function ($query) {
                $query->orderBy('version', 'asc');
            },
            'creator.profile',
            'updater.profile',
            'documents',
            'invoices',
            'histories',
            'signatures'
        ])->find($id);
    }

    public function findByIdForClient(string $id, string $userId): ?Contract
    {
        return Contract::where('id', $id)
            ->where('user_id', $userId)
            ->whereNotIn('status', ['draft'])
            ->with(['project', 'documents', 'invoices', 'currentVersion'])
            ->first();
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

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

    public function paginateForClient(string $userId, int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator
    {
        $query = Contract::where('user_id', $userId)
            ->whereNotIn('status', ['draft'])
            ->with(['project', 'documents', 'invoices']);

        if (!empty($filters['search'])) {
            $query = $this->buildSearchQuery($query, $filters['search']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $this->applySorting(
            $query,
            $sort['field'] ?? $this->getDefaultSortField(),
            $sort['direction'] ?? 'desc'
        )->paginate($perPage)->withQueryString();
    }

    /**
     * 契約番号を生成
     * フォーマット: C202407001 (C + 年月 + 連番4桁)
     */
    public function generateContractNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $prefix = "C{$year}{$month}";

        $latestContract = Contract::where('contract_number', 'like', "{$prefix}%")
            ->orderBy('contract_number', 'desc')
            ->first();

        if ($latestContract) {
            $lastNumber = (int) substr($latestContract->contract_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s%04d', $prefix, $newNumber);
    }

    public function getActiveByUser(string $userId): Collection
    {
        return Contract::where('user_id', $userId)
            ->where('status', 'active')
            ->with(['project', 'invoices'])
            ->get();
    }

    public function getByUserAndStatus(string $userId, string $status): Collection
    {
        return Contract::where('user_id', $userId)
            ->where('status', $status)
            ->with(['project', 'quote'])
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
        $baseStats = parent::getStats();

        return array_merge($baseStats, [
            'active' => Contract::where('status', 'active')->count(),
            'pending' => Contract::where('status', 'pending_signature')->count(),
            'completed' => Contract::where('status', 'completed')->count(),
            'draft' => Contract::where('status', 'draft')->count(),
            'suspended' => Contract::where('status', 'suspended')->count(),
            'cancelled' => Contract::where('status', 'cancelled')->count(),
            'total_amount' => ContractVersion::whereHas('contract', function ($query) {
                $query->whereIn('status', ['active', 'pending_signature']);
            })->where('is_current', true)->sum('total_amount'),
        ]);
    }
}
