<?php

namespace App\Services;

use App\Models\Contract;
use App\Repositories\ContractRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ContractService
{
    public function __construct(
        private ContractRepository $repository
    ) {}

    public function getPaginated(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $filters);
    }

    public function getPaginatedForClient(string $userId, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->repository->paginateForClient($userId, $perPage, $filters);
    }

    public function findById(string $id): ?Contract
    {
        return $this->repository->findById($id);
    }

    public function findByIdForClient(string $id, string $userId): ?Contract
    {
        return $this->repository->findByIdForClient($id, $userId);
    }

    public function create(array $data): Contract
    {
        return $this->repository->create($data);
    }

    public function update(Contract $contract, array $data): Contract
    {
        return $this->repository->update($contract, $data);
    }

    /**
     * 契約を有効化する（署名済み状態への遷移）
     */
    public function activate(Contract $contract, array $signedData = []): Contract
    {
        return DB::transaction(function () use ($contract, $signedData) {
            // クライアントの署名を確認
            if (!$contract->user_signed_at) {
                throw new \Exception('クライアントの署名が完了していません。契約をクライアントに送信し、署名後に有効化してください。');
            }

            $data = array_merge(['status' => 'active'], $signedData);

            if (!isset($data['signed_at'])) {
                $data['signed_at'] = now();
            }

            $contract = $this->repository->update($contract, $data);

            // ユーザーのステータスを active に変更
            if ($contract->user) {
                $contract->user->update(['status' => 'active']);
            }

            return $contract;
        });
    }

    /**
     * 契約をキャンセルする
     */
    public function cancel(Contract $contract, string $reason = ''): Contract
    {
        return DB::transaction(function () use ($contract, $reason) {
            return $this->repository->update($contract, [
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => $reason,
            ]);
        });
    }

    public function getActiveByUser(string $userId): Collection
    {
        return $this->repository->getActiveByUser($userId);
    }

    public function getByUserAndStatus(string $userId, string $status): Collection
    {
        return $this->repository->getByUserAndStatus($userId, $status);
    }

    public function getExpiringContracts(int $daysAhead = 30): Collection
    {
        return $this->repository->getExpiringContracts($daysAhead);
    }

    /**
     * ステータス遷移が可能かどうかを検証する
     */
    public function canTransitionStatus(Contract $contract, string $newStatus): bool
    {
        $allowedTransitions = [
            'draft'      => ['sent', 'cancelled'],
            'sent'       => ['active', 'cancelled'],
            'active'     => ['completed', 'cancelled', 'suspended'],
            'suspended'  => ['active', 'cancelled'],
            'completed'  => [],
            'cancelled'  => [],
        ];

        return in_array($newStatus, $allowedTransitions[$contract->status] ?? []);
    }

    /**
     * 契約の統計情報を取得
     */
    public function getStats(): array
    {
        return $this->repository->getStats();
    }
}
