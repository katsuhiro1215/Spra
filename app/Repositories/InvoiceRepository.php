<?php

namespace App\Repositories;

use App\Models\Invoice;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class InvoiceRepository extends SoftDeletableRepository implements InvoiceRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Invoice::class;
    }

    protected function getSearchableFields(): array
    {
        return [
            'invoice_number',
            'user.email',
            'company.name',
        ];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'invoice_number', 'status', 'due_date', 'total_amount'];
    }

    protected function getDefaultRelations(): array
    {
        return ['contract', 'user', 'company'];
    }

    /**
     * 詳細画面向けに全関連データを読み込んで取得する（一覧用のgetDefaultRelations()より重いため個別実装）
     */
    public function findById(string $id): mixed
    {
        return Invoice::with(['contract.currentVersion', 'user.profile', 'company', 'payments', 'items', 'receipt'])->find($id);
    }

    public function findByIdForClient(string $id, string $userId): ?Invoice
    {
        return Invoice::where('id', $id)
            ->where('user_id', $userId)
            ->whereNotIn('status', ['draft'])
            ->with(['contract.currentVersion', 'payments', 'items', 'receipt'])
            ->first();
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

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
        $query = Invoice::where('user_id', $userId)
            ->whereNotIn('status', ['draft'])
            ->with(['contract']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $this->applySorting(
            $query,
            $sort['field'] ?? $this->getDefaultSortField(),
            $sort['direction'] ?? 'desc'
        )->paginate($perPage);
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
            ->with(['user.profile', 'company', 'contract'])
            ->get();
    }

    public function getStats(): array
    {
        $baseStats = parent::getStats();

        return array_merge($baseStats, [
            'draft' => Invoice::where('status', 'draft')->count(),
            'sent' => Invoice::where('status', 'sent')->count(),
            'paid' => Invoice::where('status', 'paid')->count(),
            'overdue' => Invoice::where('status', 'overdue')->count(),
            'total_amount' => Invoice::where('status', 'paid')->sum('total_amount'),
        ]);
    }
}
