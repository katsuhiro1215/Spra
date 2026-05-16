<?php

namespace App\Services;

use App\Models\Quote;
use App\Repositories\QuoteRepository;
use Illuminate\Support\Facades\DB;

class QuoteService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param QuoteRepository $repository
     */
    public function __construct(QuoteRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     * 
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'Quote';
    }

    /**
     * 見積番号で検索
     * 
     * @param string $quoteNumber
     * @return Quote|null
     */
    public function findByQuoteNumber(string $quoteNumber): ?Quote
    {
        return $this->repository->findByQuoteNumber($quoteNumber);
    }

    /**
     * ユーザーの見積もりを取得
     * 
     * @param string $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByUser(string $userId)
    {
        return $this->repository->getByUser($userId);
    }

    /**
     * 会社の見積もりを取得
     * 
     * @param string $companyId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByCompany(string $companyId)
    {
        return $this->repository->getByCompany($companyId);
    }

    /**
     * 新しい見積もりを作成
     * 
     * @param array $data
     * @return Quote
     */
    public function createQuote(array $data): Quote
    {
        return DB::transaction(function () use ($data) {
            // 見積番号を自動生成
            if (empty($data['quote_number'])) {
                $data['quote_number'] = $this->repository->generateQuoteNumber();
            }

            // デフォルトステータス
            $data['status'] = $data['status'] ?? 'draft';

            // 作成者を設定
            $data['created_by'] = $data['created_by'] ?? auth('admins')->id();
            $data['updated_by'] = $data['updated_by'] ?? auth('admins')->id();

            $quote = $this->repository->create($data);

            // QuoteItemsがあれば作成
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    $quote->items()->create($item);
                }

                // 合計金額を再計算
                $this->recalculateAmounts($quote);
            }

            return $quote->fresh(['items']);
        });
    }

    /**
     * 見積もりを更新
     * 
     * @param Quote $quote
     * @param array $data
     * @return Quote
     */
    public function updateQuote(Quote $quote, array $data): Quote
    {
        return DB::transaction(function () use ($quote, $data) {
            // 更新者を設定
            $data['updated_by'] = $data['updated_by'] ?? auth('admins')->id();

            $this->repository->update($quote, $data);

            // QuoteItemsの更新
            if (isset($data['items'])) {
                // 既存のアイテムを削除
                $quote->items()->delete();

                // 新しいアイテムを作成
                foreach ($data['items'] as $item) {
                    $quote->items()->create($item);
                }

                // 合計金額を再計算
                $this->recalculateAmounts($quote);
            }

            return $quote->fresh(['items']);
        });
    }

    /**
     * 見積もりを削除
     * 
     * @param Quote $quote
     * @throws \Exception
     */
    public function deleteQuote(Quote $quote): void
    {
        // 承認済みの見積もりは削除できない
        if ($quote->status === 'approved') {
            throw new \Exception('承認済みの見積もりは削除できません。');
        }

        // 契約が作成されている場合は削除できない
        if ($quote->contracts()->exists()) {
            throw new \Exception('契約が作成されている見積もりは削除できません。');
        }

        DB::transaction(function () use ($quote) {
            // QuoteItemsも一緒に削除される（cascade）
            $this->repository->delete($quote);
        });
    }

    /**
     * 見積もりを送信
     * 
     * @param Quote $quote
     * @return Quote
     */
    public function sendQuote(Quote $quote): Quote
    {
        if ($quote->status !== 'draft') {
            throw new \Exception('下書き状態の見積もりのみ送信できます。');
        }

        return DB::transaction(function () use ($quote) {
            $quote->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            $this->logInfo('sent', $quote->id);

            return $quote->fresh();
        });
    }

    /**
     * 見積もりを承認
     * 
     * @param Quote $quote
     * @param string|null $clientFeedback
     * @return Quote
     */
    public function approveQuote(Quote $quote, ?string $clientFeedback = null): Quote
    {
        return DB::transaction(function () use ($quote, $clientFeedback) {
            $quote->update([
                'status' => 'approved',
                'responded_at' => now(),
                'client_feedback' => $clientFeedback,
            ]);

            $this->logInfo('approved', $quote->id);

            return $quote->fresh();
        });
    }

    /**
     * 見積もりを却下
     * 
     * @param Quote $quote
     * @param string|null $clientFeedback
     * @return Quote
     */
    public function rejectQuote(Quote $quote, ?string $clientFeedback = null): Quote
    {
        return DB::transaction(function () use ($quote, $clientFeedback) {
            $quote->update([
                'status' => 'rejected',
                'responded_at' => now(),
                'client_feedback' => $clientFeedback,
            ]);

            $this->logInfo('rejected', $quote->id);

            return $quote->fresh();
        });
    }

    /**
     * 見積もりの金額を再計算
     * 
     * @param Quote $quote
     * @return void
     */
    protected function recalculateAmounts(Quote $quote): void
    {
        $baseAmount = $quote->items()->sum('amount');
        $discountAmount = $quote->discount_amount ?? 0;
        $taxRate = $quote->tax_rate ?? config('app.default_tax_rate', 0.10);

        $subtotal = $baseAmount - $discountAmount;
        $taxAmount = round($subtotal * $taxRate);
        $totalAmount = $subtotal + $taxAmount;

        $quote->update([
            'base_amount' => $baseAmount,
            'discount_amount' => $discountAmount,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
        ]);
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'draft' => '下書き',
            'sent' => '送信済み',
            'reviewed' => '確認済み',
            'approved' => '承認済み',
            'rejected' => '却下',
            'expired' => '期限切れ',
        ];
    }
}
