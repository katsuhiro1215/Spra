<?php

namespace App\Repositories;

use App\Models\Payment;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class PaymentRepository extends BaseRepository implements PaymentRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Payment::class;
    }

    protected function getSearchableFields(): array
    {
        return ['transaction_id'];
    }

    protected function getSortableFields(): array
    {
        return ['payment_date', 'created_at', 'amount', 'status'];
    }

    protected function getDefaultSortField(): string
    {
        return 'payment_date';
    }

    protected function getDefaultRelations(): array
    {
        return ['invoice'];
    }

    /**
     * 詳細画面向けに全関連データを読み込んで取得する（一覧用のgetDefaultRelations()より重いため個別実装）
     */
    public function findById(string $id): mixed
    {
        return Payment::with(['invoice', 'confirmedBy'])->find($id);
    }

    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

        if (!empty($filters['invoice_id'])) {
            $query->where('invoice_id', $filters['invoice_id']);
        }

        if (!empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        return $query;
    }

    /**
     * 一覧画面向けに請求書のユーザー情報も読み込んで取得する
     */
    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): \Illuminate\Pagination\LengthAwarePaginator
    {
        $query = $this->findWithFilters($filters)->with(['invoice.user.profile']);

        return $this->applySorting(
            $query,
            $sort['field'] ?? $this->getDefaultSortField(),
            $sort['direction'] ?? 'desc'
        )->paginate($perPage)->withQueryString();
    }

    public function confirm(Payment $payment, string $confirmedByAdminId): Payment
    {
        $payment->update([
            'status' => 'completed',
            'confirmed_by' => $confirmedByAdminId,
            'confirmed_at' => now(),
        ]);
        return $payment->fresh();
    }
}
