<?php

namespace App\Services;

use App\Mail\SendQuoteMail;
use App\Models\Quote;
use App\Models\QuoteResponse;
use App\Repositories\QuoteRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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

            // 金額フィールドのデフォルト値を設定
            if (!isset($data['base_amount'])) {
                $data['base_amount'] = 0;
            }
            if (!isset($data['tax_amount'])) {
                $data['tax_amount'] = 0;
            }
            if (!isset($data['total_amount'])) {
                $data['total_amount'] = 0;
            }

            // custom_specificationsは既にJSON文字列なのでそのまま渡す
            // (Quote::$castsで自動的にJSONとして処理される)

            $quote = $this->repository->create($data);

            // QuoteItemsがあれば作成
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    // amountを計算（quantity × unit_price）
                    if (!isset($item['amount'])) {
                        $quantity = (float)($item['quantity'] ?? 1);
                        $unitPrice = (float)($item['unit_price'] ?? 0);
                        $item['amount'] = $quantity * $unitPrice;
                    }
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

            // 金額フィールドのデフォルト値を設定
            if (!isset($data['base_amount'])) {
                $data['base_amount'] = $quote->base_amount ?? 0;
            }
            if (!isset($data['tax_amount'])) {
                $data['tax_amount'] = $quote->tax_amount ?? 0;
            }
            if (!isset($data['total_amount'])) {
                $data['total_amount'] = $quote->total_amount ?? 0;
            }

            // custom_specificationsは既にJSON文字列なのでそのまま渡す
            // (Quote::$castsで自動的にJSONとして処理される)

            $this->repository->update($quote, $data);

            // QuoteItemsの更新
            if (isset($data['items'])) {
                // 既存のアイテムを削除
                $quote->items()->delete();

                // 新しいアイテムを作成
                foreach ($data['items'] as $item) {
                    // amountを計算（quantity × unit_price）
                    if (!isset($item['amount'])) {
                        $quantity = (float)($item['quantity'] ?? 1);
                        $unitPrice = (float)($item['unit_price'] ?? 0);
                        $item['amount'] = $quantity * $unitPrice;
                    }
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
     * @param string|null $token
     * @param string $responseFormUrl
     * @return Quote
     */
    public function sendQuote(Quote $quote, ?string $token = null, string $responseFormUrl = ''): Quote
    {
        if (!in_array($quote->status, ['draft', 'reviewed'])) {
            throw new \Exception('下書き或いは確認済み状態の見積もりのみ送信できます。');
        }

        return DB::transaction(function () use ($quote, $token, $responseFormUrl) {
            // Load relationships for email
            $quote->load(['user.profile', 'contact', 'items']);

            // Get recipient email
            $recipientEmail = $quote->user?->email ?? $quote->contact?->email;

            if (!$recipientEmail) {
                throw new \Exception('送信先のメールアドレスが指定されていません。');
            }

            // Generate token if not provided
            if (!$token) {
                $token = \Illuminate\Support\Str::random(60);
            }

            // Create QuoteResponse with token
            $quoteResponse = \App\Models\QuoteResponse::create([
                'quote_id' => $quote->id,
                'token' => $token,
                'email' => $recipientEmail,
                'response_type' => null,
            ]);

            // Use provided responseFormUrl or generate one (fallback)
            $formUrl = $responseFormUrl ?: route('user.public.quote.response.show', $token);

            // Send email with response form URL
            Mail::to($recipientEmail)->send(new SendQuoteMail(
                $quote,
                $formUrl
            ));

            // Update quote status
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
        $taxRate = ($quote->tax_rate ?? 10) / 100; // 整数（10）を小数（0.10）に変換

        $subtotal = $baseAmount - $discountAmount;
        $taxAmount = round($subtotal * $taxRate);
        $totalAmount = $subtotal + $taxAmount;

        $quote->update([
            'base_amount' => $baseAmount,
            'discount_amount' => $discountAmount,
            'tax_rate' => $quote->tax_rate ?? 10, // 元の整数値を保存
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

    /**
     * ServiceItemから見積もり明細データを作成
     *
     * @param \App\Models\ServiceItem $serviceItem
     * @param array $overrides 上書きするデータ（quantity, unit_priceなど）
     * @return array
     */
    public function createQuoteItemFromServiceItem($serviceItem, array $overrides = []): array
    {
        $quantity = $overrides['quantity'] ?? 1;
        $unitPrice = $overrides['unit_price'] ?? $serviceItem->price;
        $amount = $quantity * $unitPrice;

        // ServicePlanからbilling_cycleを取得
        $billingType = 'one_time';
        if ($serviceItem->service_plan_id && $serviceItem->servicePlan) {
            $billingType = $serviceItem->servicePlan->billing_cycle ?? 'one_time';
        }

        return array_merge([
            'service_id' => $serviceItem->service_id,
            'service_plan_id' => $serviceItem->service_plan_id,
            'service_item_id' => $serviceItem->id,
            'name' => $serviceItem->name,
            'description' => $serviceItem->description,
            'item_type' => $serviceItem->item_type,
            'billing_type' => $billingType,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'amount' => $amount,
            'estimated_days' => $serviceItem->estimated_days,
        ], $overrides);
    }

    /**
     * 複数のServiceItemから見積もり明細データを一括作成
     *
     * @param array $serviceItemIds ServiceItem IDの配列 or ['id' => ID, 'quantity' => 数量]の配列
     * @return array
     */
    public function createQuoteItemsFromServiceItems(array $serviceItemIds): array
    {
        $items = [];
        $sortOrder = 0;

        foreach ($serviceItemIds as $key => $value) {
            // ['id' => ID, 'quantity' => 数量] 形式
            if (is_array($value)) {
                $serviceItemId = $value['id'];
                $overrides = array_merge($value, ['sort_order' => $sortOrder++]);
            } else {
                // シンプルなID配列
                $serviceItemId = $value;
                $overrides = ['sort_order' => $sortOrder++];
            }

            $serviceItem = \App\Models\ServiceItem::find($serviceItemId);
            if ($serviceItem) {
                $items[] = $this->createQuoteItemFromServiceItem($serviceItem, $overrides);
            }
        }

        return $items;
    }
}
