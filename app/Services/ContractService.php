<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\Quote;
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

    /**
     * 新しい契約を作成
     *
     * Contract作成 → ContractVersion v1 作成 → ContractItems作成
     *
     * @param array $data
     * @return Contract
     */
    public function createContract(array $data): Contract
    {
        return DB::transaction(function () use ($data) {
            // 契約番号を自動生成
            if (empty($data['contract_number'])) {
                $data['contract_number'] = $this->generateContractNumber();
            }

            // 作成者を設定
            $createdBy = $data['created_by'] ?? auth('admins')->id();

            // Contract を作成（プロジェクト管理レベル）
            $contractData = [
                'contract_number' => $data['contract_number'],
                'quote_id' => $data['quote_id'] ?? null,
                'user_id' => $data['user_id'],
                'company_id' => $data['company_id'] ?? null,
                'contract_group_id' => $data['contract_group_id'] ?? null,
                'parent_contract_id' => $data['parent_contract_id'] ?? null,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'type' => $data['type'] ?? 'one_time',
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'status' => $data['status'] ?? 'draft',
                'billing_day' => $data['billing_day'] ?? 10,
                'payment_due_days' => $data['payment_due_days'] ?? 15,
                'auto_invoice_generation' => $data['auto_invoice_generation'] ?? true,
                'auto_renewal' => $data['auto_renewal'] ?? false,
                'renewal_notice_days' => $data['renewal_notice_days'] ?? 30,
                'signature_required_from' => $data['signature_required_from'] ?? 'user',
                'created_by' => $createdBy,
            ];

            $contract = $this->repository->create($contractData);

            // ContractVersion v1 を作成（契約書テキスト・金額のみ）
            $versionData = [
                'contract_id' => $contract->id,
                'version' => 1,
                'terms_and_conditions' => $data['terms_and_conditions'] ?? null,
                'special_provisions' => $data['special_provisions'] ?? null,
                'notes' => $data['notes'] ?? null,
                'base_amount' => 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'tax_rate' => $data['tax_rate'] ?? 10,
                'tax_amount' => 0,
                'total_amount' => 0,
                'status' => 'draft',
                'is_current' => true,
                'created_by' => $createdBy,
            ];

            $contractVersion = $contract->versions()->create($versionData);

            // Contract に current_version_id を設定
            $contract->update(['current_version_id' => $contractVersion->id]);

            // items は ContractItemController で別途追加する

            return $contract->fresh(['versions', 'currentVersion']);
        });
    }

    /**
     * Quote から Contract を作成
     * QuoteItem を ContractItem にコピーしてスナップショット化
     *
     * @param Quote $quote
     * @param array $additionalData
     * @return Contract
     */
    public function createFromQuote(Quote $quote, array $additionalData = []): Contract
    {
        return DB::transaction(function () use ($quote, $additionalData) {
            $quote->load(['currentVersion.items', 'user', 'company']);

            if (!$quote->currentVersion) {
                throw new \Exception('見積もりに有効なバージョンがありません。');
            }

            $createdBy = $additionalData['created_by'] ?? auth('admins')->id();

            // Contract データを準備
            $contractData = [
                'contract_number' => $this->generateContractNumber(),
                'quote_id' => $quote->id,
                'user_id' => $quote->user_id,
                'company_id' => $quote->company_id,
                'title' => $additionalData['title'] ?? $quote->title,
                'description' => $additionalData['description'] ?? $quote->requirements,
                'type' => $additionalData['type'] ?? 'one_time',
                'start_date' => $additionalData['start_date'] ?? now(),
                'end_date' => $additionalData['end_date'] ?? null,
                'terms_and_conditions' => $additionalData['terms_and_conditions'] ?? null,
                'special_provisions' => $additionalData['special_provisions'] ?? null,
                'notes' => $additionalData['notes'] ?? null,
                'created_by' => $createdBy,
            ];

            // QuoteVersion から金額情報をコピー
            $contractData['base_amount'] = $quote->currentVersion->base_amount;
            $contractData['discount_amount'] = $quote->currentVersion->discount_amount;
            $contractData['tax_rate'] = $quote->currentVersion->tax_rate;
            $contractData['tax_amount'] = $quote->currentVersion->tax_amount;
            $contractData['total_amount'] = $quote->currentVersion->total_amount;

            // QuoteItem を ContractItem にコピー
            $contractData['items'] = $quote->currentVersion->items->map(function ($quoteItem) {
                return [
                    'service_id' => $quoteItem->service_id,
                    'service_item_id' => $quoteItem->service_item_id,
                    'name' => $quoteItem->name,
                    'description' => $quoteItem->description,
                    'item_type' => $quoteItem->item_type,
                    'billing_type' => $quoteItem->billing_type,
                    'quantity' => $quoteItem->quantity,
                    'unit_price' => $quoteItem->unit_price,
                    'amount' => $quoteItem->amount,
                    'estimated_days' => $quoteItem->estimated_days,
                    'sort_order' => $quoteItem->sort_order,
                ];
            })->toArray();

            // Contract を作成
            $contract = $this->createContract($contractData);

            // Quote のステータスを contracted に更新
            $quote->update(['status' => 'contracted']);

            return $contract;
        });
    }

    /**
     * 契約を更新
     *
     * 常に新しいバージョンを作成して履歴を保持
     *
     * @param Contract $contract
     * @param array $data
     * @return Contract
     */
    public function updateContract(Contract $contract, array $data): Contract
    {
        return DB::transaction(function () use ($contract, $data) {
            // Contract レベルの情報を更新
            $contractUpdate = [];
            if (isset($data['title'])) {
                $contractUpdate['title'] = $data['title'];
            }
            if (isset($data['description'])) {
                $contractUpdate['description'] = $data['description'];
            }
            if (isset($data['start_date'])) {
                $contractUpdate['start_date'] = $data['start_date'];
            }
            if (isset($data['end_date'])) {
                $contractUpdate['end_date'] = $data['end_date'];
            }
            if (isset($data['status'])) {
                $contractUpdate['status'] = $data['status'];
            }
            $contractUpdate['updated_by'] = $data['updated_by'] ?? auth('admins')->id();

            $contract->update($contractUpdate);

            // 現在のバージョンを取得
            $currentVersion = $contract->currentVersion;

            if (!$currentVersion) {
                throw new \Exception('現在のバージョンが見つかりません。');
            }

            // draft状態なら現在のバージョンを上書き更新、それ以外は新しいバージョンを作成
            if ($currentVersion->status === 'draft') {
                // draft状態: 既存バージョンを上書き更新
                $versionUpdate = [
                    'terms_and_conditions' => $data['terms_and_conditions'] ?? $currentVersion->terms_and_conditions,
                    'special_provisions' => $data['special_provisions'] ?? $currentVersion->special_provisions,
                    'notes' => $data['notes'] ?? $currentVersion->notes,
                    'discount_amount' => $data['discount_amount'] ?? $currentVersion->discount_amount,
                    'tax_rate' => $data['tax_rate'] ?? $currentVersion->tax_rate,
                    'updated_by' => auth('admins')->id(),
                ];
                $currentVersion->update($versionUpdate);

                // 既存のitemsを削除
                $currentVersion->items()->delete();

                // ContractItems を作成
                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        if (!isset($item['amount'])) {
                            $quantity = (float)($item['quantity'] ?? 1);
                            $unitPrice = (float)($item['unit_price'] ?? 0);
                            $item['amount'] = $quantity * $unitPrice;
                        }
                        $item['contract_version_id'] = $currentVersion->id;
                        $currentVersion->items()->create($item);
                    }

                    // 合計金額を再計算
                    $this->recalculateVersionAmounts($currentVersion);
                }

                return $contract->fresh(['versions', 'currentVersion.items']);
            } else {
                // sent以上の状態: 新しいバージョンを作成（テキスト修正や金額変更の履歴として）
                $newVersion = $currentVersion->version + 1;

                $versionData = [
                    'contract_id' => $contract->id,
                    'version' => $newVersion,
                    'terms_and_conditions' => $data['terms_and_conditions'] ?? $currentVersion->terms_and_conditions,
                    'special_provisions' => $data['special_provisions'] ?? $currentVersion->special_provisions,
                    'notes' => $data['notes'] ?? $currentVersion->notes,
                    'base_amount' => 0,
                    'discount_amount' => $data['discount_amount'] ?? $currentVersion->discount_amount,
                    'tax_rate' => $data['tax_rate'] ?? $currentVersion->tax_rate,
                    'tax_amount' => 0,
                    'total_amount' => 0,
                    'status' => 'draft',
                    'revision_reason' => $data['revision_reason'] ?? null,
                    'is_current' => true,
                    'created_by' => auth('admins')->id(),
                ];

                $newContractVersion = $contract->versions()->create($versionData);

                // 旧バージョンの is_current を false に（履歴として保持）
                $currentVersion->update(['is_current' => false, 'status' => 'superseded']);

                // ContractItems を新バージョンに作成
                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        if (!isset($item['amount'])) {
                            $quantity = (float)($item['quantity'] ?? 1);
                            $unitPrice = (float)($item['unit_price'] ?? 0);
                            $item['amount'] = $quantity * $unitPrice;
                        }
                        $item['contract_version_id'] = $newContractVersion->id;
                        $newContractVersion->items()->create($item);
                    }

                    // 合計金額を再計算
                    $this->recalculateVersionAmounts($newContractVersion);
                } else {
                    // アイテムがない場合、旧バージョンのアイテムを複製
                    foreach ($currentVersion->items as $oldItem) {
                        $newItem = $oldItem->replicate();
                        $newItem->contract_version_id = $newContractVersion->id;
                        $newItem->save();
                    }

                    // 合計金額を再計算
                    $this->recalculateVersionAmounts($newContractVersion);
                }

                // Contract の current_version_id を新バージョンに更新
                $contract->update([
                    'current_version_id' => $newContractVersion->id,
                    'status' => 'draft', // 新しいバージョン作成後、ドラフト状態にリセット
                ]);

                return $contract->fresh(['versions', 'currentVersion.items']);
            }
        });
    }

    /**
     * ContractVersion の金額を再計算
     *
     * @param ContractVersion $version
     * @return void
     */
    public function recalculateVersionAmounts(ContractVersion $version): void
    {
        $baseAmount = $version->items()->sum('amount');
        $discountAmount = $version->discount_amount ?? 0;
        $taxableAmount = $baseAmount - $discountAmount;
        $taxAmount = $taxableAmount * ($version->tax_rate / 100);
        $totalAmount = $taxableAmount + $taxAmount;

        $version->update([
            'base_amount' => $baseAmount,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
        ]);
    }

    /**
     * 契約番号を生成
     *
     * @return string
     */
    private function generateContractNumber(): string
    {
        return $this->repository->generateContractNumber();
    }
}
