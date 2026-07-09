<?php

namespace App\Services;

use App\Mail\SendQuoteMail;
use App\Models\Quote;
use App\Models\QuoteResponse;
use App\Models\ServiceItem;
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
     * Quote作成 → QuoteVersion v1 作成 → QuoteItems作成
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

            // Quote のステータス（案件管理）
            $quoteStatus = $data['status'] ?? 'draft';
            if (!in_array($quoteStatus, ['draft', 'negotiating', 'approved', 'rejected', 'contracted', 'cancelled'])) {
                $quoteStatus = 'draft';
            }

            // 作成者を設定
            $createdBy = $data['created_by'] ?? auth('admins')->id();

            // Quote を作成（プロジェクト管理レベル）
            $quoteData = [
                'quote_number' => $data['quote_number'],
                'user_id' => $data['user_id'] ?? null,
                'contact_id' => $data['contact_id'] ?? null,
                'company_id' => $data['company_id'] ?? null,
                'title' => $data['title'] ?? '',
                'requirements' => $data['requirements'] ?? null,
                'status' => $quoteStatus,
                'created_by' => $createdBy,
            ];

            $quote = $this->repository->create($quoteData);

            // QuoteVersion v1 を作成（見積ドキュメント）
            $versionData = [
                'quote_id' => $quote->id,
                'version' => 1,
                'title' => $data['title'] ?? '',
                'requirements' => $data['requirements'] ?? null,
                'custom_specifications' => $data['custom_specifications'] ?? null,
                'base_amount' => 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'tax_rate' => $data['tax_rate'] ?? 10,
                'tax_amount' => 0,
                'total_amount' => 0,
                'status' => 'draft',
                'is_current' => true,
                'created_by' => $createdBy,
            ];

            $quoteVersion = $quote->versions()->create($versionData);

            // Quoteに current_version_id を設定
            $quote->update(['current_version_id' => $quoteVersion->id]);

            // items は QuoteItemController で別途追加する

            return $quote->fresh(['versions', 'currentVersion']);
        });
    }

    /**
     * 見積もりを更新
     *
     * 常に新しいバージョンを作成して履歴を保持
     * 更新のたびに version をインクリメント
     * 最新バージョンのみが current_version_id として参照される
     *
     * @param Quote $quote
     * @param array $data
     * @return Quote
     */
    public function updateQuote(Quote $quote, array $data): Quote
    {
        return DB::transaction(function () use ($quote, $data) {
            // Quote レベルの情報を更新（プロジェクト管理情報）
            $quoteUpdate = [];
            if (isset($data['title'])) {
                $quoteUpdate['title'] = $data['title'];
            }
            if (isset($data['requirements'])) {
                $quoteUpdate['requirements'] = $data['requirements'];
            }
            if (isset($data['status'])) {
                $quoteUpdate['status'] = $data['status'];
            }
            $quoteUpdate['updated_by'] = $data['updated_by'] ?? auth('admins')->id();

            $quote->update($quoteUpdate);

            // 現在のバージョンを取得
            $currentVersion = $quote->currentVersion;

            if (!$currentVersion) {
                throw new \Exception('現在のバージョンが見つかりません。');
            }

            // draft状態なら現在のバージョンを上書き更新、それ以外は新しいバージョンを作成
            if ($currentVersion->status === 'draft') {
                // draft状態: 既存バージョンを上書き更新
                $versionUpdate = [
                    'title' => $data['title'] ?? $currentVersion->title,
                    'requirements' => $data['requirements'] ?? $currentVersion->requirements,
                    'custom_specifications' => $data['custom_specifications'] ?? $currentVersion->custom_specifications,
                    'discount_amount' => $data['discount_amount'] ?? $currentVersion->discount_amount,
                    'tax_rate' => $data['tax_rate'] ?? $currentVersion->tax_rate,
                    'updated_by' => auth('admins')->id(),
                ];
                $currentVersion->update($versionUpdate);

                // 既存のitemsを削除
                $currentVersion->items()->delete();

                // QuoteItems を作成
                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        // service_id を確保
                        $item = $this->ensureServiceIdInItem($item);

                        if (!isset($item['amount'])) {
                            $quantity = (float)($item['quantity'] ?? 1);
                            $unitPrice = (float)($item['unit_price'] ?? 0);
                            $item['amount'] = $quantity * $unitPrice;
                        }
                        $item['quote_version_id'] = $currentVersion->id;
                        $currentVersion->items()->create($item);
                    }

                    // 合計金額を再計算
                    $this->recalculateVersionAmounts($currentVersion);
                }

                return $quote->fresh(['versions', 'currentVersion.items']);
            } else {
                // sent以上の状態: 新しいバージョンを作成
                // バージョン番号をインクリメント
                $newVersion = $currentVersion->version + 1;

                $versionData = [
                    'quote_id' => $quote->id,
                    'version' => $newVersion,
                    'title' => $data['title'] ?? $currentVersion->title,
                    'requirements' => $data['requirements'] ?? $currentVersion->requirements,
                    'custom_specifications' => $data['custom_specifications'] ?? $currentVersion->custom_specifications,
                    'base_amount' => 0,
                    'discount_amount' => $data['discount_amount'] ?? $currentVersion->discount_amount,
                    'tax_rate' => $data['tax_rate'] ?? $currentVersion->tax_rate,
                    'tax_amount' => 0,
                    'total_amount' => 0,
                    'status' => 'draft', // 新バージョンはドラフト状態で作成
                    'is_current' => true, // 新バージョンを現在のバージョンにセット
                    'created_by' => auth('admins')->id(),
                ];

                $newQuoteVersion = $quote->versions()->create($versionData);

                // 旧バージョンの is_current を false に（履歴として保持）
                $currentVersion->update(['is_current' => false]);

                // QuoteItems を新バージョンに作成
                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        // service_id を確保
                        $item = $this->ensureServiceIdInItem($item);

                        if (!isset($item['amount'])) {
                            $quantity = (float)($item['quantity'] ?? 1);
                            $unitPrice = (float)($item['unit_price'] ?? 0);
                            $item['amount'] = $quantity * $unitPrice;
                        }
                        $item['quote_version_id'] = $newQuoteVersion->id;
                        $newQuoteVersion->items()->create($item);
                    }

                    // 合計金額を再計算
                    $this->recalculateVersionAmounts($newQuoteVersion);
                } else {
                    // アイテムがない場合、旧バージョンのアイテムを複製
                    foreach ($currentVersion->items as $oldItem) {
                        $newItem = $oldItem->replicate();
                        $newItem->quote_version_id = $newQuoteVersion->id;
                        $newItem->save();
                    }

                    // 合計金額を再計算
                    $this->recalculateVersionAmounts($newQuoteVersion);
                }

                // Quote の current_version_id を新バージョンに更新
                // 見積修正時はステータスを draft に戻して、再度送信可能にする
                $quote->update([
                    'current_version_id' => $newQuoteVersion->id,
                    'status' => 'draft', // 新しいバージョン作成後、ドラフト状態にリセット
                ]);

                return $quote->fresh(['versions', 'currentVersion.items']);
            }
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

        DB::transaction(function () use ($quote) {
            // QuoteVersionsとQuoteItemsも一緒に削除される（cascade）
            $this->repository->delete($quote);
        });
    }

    /**
     * 見積もりを送信
     *
     * 現在のQuoteVersionのステータスを'sent'に変更
     *
     * @param Quote $quote
     * @param string|null $token
     * @param string $responseFormUrl
     * @return Quote
     */
    public function sendQuote(Quote $quote, ?string $token = null, string $responseFormUrl = ''): Quote
    {
        $currentVersion = $quote->currentVersion;

        if (!$currentVersion) {
            throw new \Exception('現在のバージョンが見つかりません。');
        }

        if (!in_array($currentVersion->status, ['draft', 'revision_requested'])) {
            throw new \Exception('ドラフト或いは修正要求済み状態の見積もりのみ送信できます。');
        }

        return DB::transaction(function () use ($quote, $currentVersion, $token, $responseFormUrl) {
            // Load relationships for email
            $quote->load(['user.profile', 'contact', 'currentVersion.items.serviceItem']);

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
            \App\Models\QuoteResponse::create([
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

            // Update QuoteVersion status
            $currentVersion->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            // Update Quote status to negotiating if still draft
            if ($quote->status === 'draft') {
                $quote->update(['status' => 'negotiating']);
            }

            $this->logInfo('sent', $quote->id);

            return $quote->fresh(['currentVersion']);
        });
    }

    /**
     * 見積もりを承認
     *
     * 現在のQuoteVersionのステータスを'approved'に変更
     *
     * @param Quote $quote
     * @param string|null $clientFeedback
     * @return Quote
     */
    public function approveQuote(Quote $quote, ?string $clientFeedback = null): Quote
    {
        $currentVersion = $quote->currentVersion;

        if (!$currentVersion) {
            throw new \Exception('現在のバージョンが見つかりません。');
        }

        return DB::transaction(function () use ($quote, $currentVersion, $clientFeedback) {
            // QuoteVersion のステータスを approved に
            $currentVersion->update([
                'status' => 'approved',
                'responded_at' => now(),
                'client_feedback' => $clientFeedback,
            ]);

            // Quote のステータスも approved に
            $quote->update([
                'status' => 'approved',
            ]);

            $this->logInfo('approved', $quote->id);

            return $quote->fresh(['currentVersion']);
        });
    }

    /**
     * 見積もりを却下
     *
     * 現在のQuoteVersionのステータスを'rejected'に変更
     *
     * @param Quote $quote
     * @param string|null $clientFeedback
     * @return Quote
     */
    public function rejectQuote(Quote $quote, ?string $clientFeedback = null): Quote
    {
        $currentVersion = $quote->currentVersion;

        if (!$currentVersion) {
            throw new \Exception('現在のバージョンが見つかりません。');
        }

        return DB::transaction(function () use ($quote, $currentVersion, $clientFeedback) {
            // QuoteVersion のステータスを rejected に
            $currentVersion->update([
                'status' => 'rejected',
                'responded_at' => now(),
                'client_feedback' => $clientFeedback,
            ]);

            // Quote のステータスも rejected に
            $quote->update([
                'status' => 'rejected',
            ]);

            $this->logInfo('rejected', $quote->id);

            return $quote->fresh(['currentVersion']);
        });
    }

    /**
     * QuoteVersionの合計金額を再計算
     */
    public function recalculateVersionAmounts(\App\Models\QuoteVersion $quoteVersion): void
    {
        $baseAmount = $quoteVersion->items()->sum('amount');
        $discountAmount = $quoteVersion->discount_amount ?? 0;
        $taxRate = ($quoteVersion->tax_rate ?? 10) / 100; // 整数（10）を小数（0.10）に変換

        $subtotal = $baseAmount - $discountAmount;
        $taxAmount = round($subtotal * $taxRate);
        $totalAmount = $subtotal + $taxAmount;

        $quoteVersion->update([
            'base_amount' => $baseAmount,
            'discount_amount' => $discountAmount,
            'tax_rate' => $quoteVersion->tax_rate ?? 10, // 元の整数値を保存
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
        ]);
    }

    /**
     * Quoteのステータス定義を取得
     */
    public function getStatuses(): array
    {
        return [
            'draft' => '下書き',
            'negotiating' => '交渉中',
            'approved' => '承認済み',
            'rejected' => '却下',
            'contracted' => '契約済み',
            'cancelled' => 'キャンセル',
        ];
    }

    /**
     * QuoteVersionのステータス定義を取得
     */
    public function getVersionStatuses(): array
    {
        return [
            'draft' => '下書き',
            'sent' => '送信済み',
            'viewed' => '確認済み',
            'revision_requested' => '修正要求',
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

        // billing_typeはoverridesから取得、またはデフォルト値
        $billingType = $overrides['billing_type'] ?? 'one_time';

        return array_merge([
            'service_id' => $serviceItem->service_id,
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

    /**
     * 見積もり明細データに service_id を付与（必要に応じて service_item_id から取得）
     *
     * @param array $item 見積もり明細データ
     * @return array service_id を含む見積もり明細データ
     */
    private function ensureServiceIdInItem(array $item): array
    {
        // service_id がない場合、service_item_id から取得
        if (empty($item['service_id']) && !empty($item['service_item_id'])) {
            $serviceItem = ServiceItem::find($item['service_item_id']);
            if ($serviceItem) {
                $item['service_id'] = $serviceItem->service_id;
            } else {
                throw new \Exception('Service Item not found: ' . $item['service_item_id']);
            }
        }

        if (empty($item['service_id'])) {
            throw new \Exception('service_id is required in quote item');
        }

        return $item;
    }
}
