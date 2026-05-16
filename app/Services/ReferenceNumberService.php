<?php

namespace App\Services;

use App\Models\ReferenceNumber;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * 参照番号サービス
 *
 * 各エンティティに対して一意の人間が読みやすい参照番号を生成・管理する
 * 例: PRJ-202605-0001
 *
 * 重要な制約:
 * - 番号は一度発行したら変更不可（immutable）
 * - ソフトデリート後も番号は再利用しない
 * - トランザクション内で生成して重複を防ぐ
 */
class ReferenceNumberService
{
    /**
     * 参照番号を生成
     *
     * @param string $prefix プレフィックス (LED, CTR, PRJ, etc.)
     * @param string $entityType エンティティタイプ (Lead, Contract, Project, etc.)
     * @param string $entityId エンティティのULID
     * @param string|null $yearMonth 年月 (YYYYMMのフォーマット, nullの場合は現在の年月)
     * @return ReferenceNumber
     * @throws Exception
     */
    public function generate(
        string $prefix,
        string $entityType,
        string $entityId,
        ?string $yearMonth = null
    ): ReferenceNumber {
        // 年月の検証
        $yearMonth = $yearMonth ?? now()->format('Ym');

        if (!$this->validateYearMonth($yearMonth)) {
            throw new Exception("Invalid year-month format: {$yearMonth}. Expected: YYYYMM");
        }

        // プレフィックスの検証
        if (!$this->isValidPrefix($prefix)) {
            throw new Exception("Invalid prefix: {$prefix}");
        }

        try {
            // トランザクション内で生成（重複防止）
            return DB::transaction(function () use ($prefix, $entityType, $entityId, $yearMonth) {
                // 次の連番を取得（withTrashedを使って削除済みも含めて連番を管理）
                $sequence = $this->getNextSequence($prefix, $yearMonth);

                // 参照番号を構築
                $referenceNumber = sprintf(
                    '%s-%s-%04d',
                    strtoupper($prefix),
                    $yearMonth,
                    $sequence
                );

                // 参照番号レコードを作成
                $refNumber = ReferenceNumber::create([
                    'prefix' => strtoupper($prefix),
                    'year_month' => $yearMonth,
                    'sequence' => $sequence,
                    'reference_number' => $referenceNumber,
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                    'is_active' => true,
                ]);

                Log::info('Reference number generated', [
                    'reference_number' => $referenceNumber,
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                ]);

                return $refNumber;
            });
        } catch (Exception $e) {
            Log::error('Failed to generate reference number', [
                'prefix' => $prefix,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'error' => $e->getMessage(),
            ]);

            throw new Exception("Failed to generate reference number: {$e->getMessage()}");
        }
    }

    /**
     * 次の連番を取得
     *
     * 削除済みのレコードも含めて連番を管理し、番号の再利用を防ぐ
     *
     * @param string $prefix
     * @param string $yearMonth
     * @return int
     */
    protected function getNextSequence(string $prefix, string $yearMonth): int
    {
        // 削除済みも含めて最大値を取得
        $maxSequence = ReferenceNumber::withTrashed()
            ->where('prefix', strtoupper($prefix))
            ->where('year_month', $yearMonth)
            ->lockForUpdate() // 悲観的ロック
            ->max('sequence');

        return ($maxSequence ?? 0) + 1;
    }

    /**
     * エンティティの参照番号を取得
     *
     * @param string $entityType
     * @param string $entityId
     * @return ReferenceNumber|null
     */
    public function getByEntity(string $entityType, string $entityId): ?ReferenceNumber
    {
        return ReferenceNumber::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->first();
    }

    /**
     * 参照番号文字列から検索
     *
     * @param string $referenceNumber
     * @return ReferenceNumber|null
     */
    public function findByNumber(string $referenceNumber): ?ReferenceNumber
    {
        return ReferenceNumber::where('reference_number', $referenceNumber)->first();
    }

    /**
     * 参照番号を無効化
     *
     * @param string $entityType
     * @param string $entityId
     * @return bool
     */
    public function deactivate(string $entityType, string $entityId): bool
    {
        $refNumber = $this->getByEntity($entityType, $entityId);

        if (!$refNumber) {
            return false;
        }

        return $refNumber->deactivate();
    }

    /**
     * 参照番号を再アクティブ化
     *
     * @param string $entityType
     * @param string $entityId
     * @return bool
     */
    public function activate(string $entityType, string $entityId): bool
    {
        $refNumber = $this->getByEntity($entityType, $entityId);

        if (!$refNumber) {
            return false;
        }

        return $refNumber->activate();
    }

    /**
     * プレフィックスが有効かチェック
     *
     * @param string $prefix
     * @return bool
     */
    protected function isValidPrefix(string $prefix): bool
    {
        return array_key_exists(strtoupper($prefix), ReferenceNumber::PREFIXES);
    }

    /**
     * 年月フォーマットの検証
     *
     * @param string $yearMonth
     * @return bool
     */
    protected function validateYearMonth(string $yearMonth): bool
    {
        // YYYYMMの形式かチェック
        if (!preg_match('/^\d{6}$/', $yearMonth)) {
            return false;
        }

        $year = substr($yearMonth, 0, 4);
        $month = substr($yearMonth, 4, 2);

        // 年と月の妥当性チェック
        return checkdate((int)$month, 1, (int)$year);
    }

    /**
     * 指定期間の参照番号統計を取得
     *
     * @param string $prefix
     * @param string $yearMonth
     * @return array
     */
    public function getStatistics(string $prefix, string $yearMonth): array
    {
        $query = ReferenceNumber::where('prefix', strtoupper($prefix))
            ->where('year_month', $yearMonth);

        return [
            'total' => (clone $query)->withTrashed()->count(),
            'active' => (clone $query)->where('is_active', true)->count(),
            'inactive' => (clone $query)->where('is_active', false)->count(),
            'deleted' => (clone $query)->onlyTrashed()->count(),
            'max_sequence' => (clone $query)->withTrashed()->max('sequence') ?? 0,
        ];
    }

    /**
     * 参照番号の存在チェック
     *
     * @param string $referenceNumber
     * @return bool
     */
    public function exists(string $referenceNumber): bool
    {
        return ReferenceNumber::where('reference_number', $referenceNumber)->exists();
    }

    /**
     * 既に参照番号が発行されているかチェック
     *
     * @param string $entityType
     * @param string $entityId
     * @return bool
     */
    public function hasReferenceNumber(string $entityType, string $entityId): bool
    {
        return ReferenceNumber::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->exists();
    }
}
