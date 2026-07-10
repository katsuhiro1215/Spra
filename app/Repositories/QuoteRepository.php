<?php

namespace App\Repositories;

use App\Models\Quote;
use App\Models\QuoteVersion;
use App\Repositories\Contracts\QuoteRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class QuoteRepository extends SoftDeletableRepository implements QuoteRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return Quote::class;
    }

    /**
     * 検索対象フィールドを返す
     * 
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return [
            'quote_number',
            'subject',
            'message',
            'notes',
        ];
    }

    /**
     * ソート可能フィールドを返す
     * 
     * @return array
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'updated_at',
            'quote_number',
            'status',
            'total_amount',
            'sent_at',
            'valid_until',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return [
            'user.profile',
            'contact',
            'company',
            'currentVersion.items.serviceItem',
            'creator.profile',
            'updater.profile'
        ];
    }

    /**
     * 見積番号で検索
     * 
     * @param string $quoteNumber
     * @return Quote|null
     */
    public function findByQuoteNumber(string $quoteNumber): ?Quote
    {
        return Quote::where('quote_number', $quoteNumber)
            ->with($this->getDefaultRelations())
            ->first();
    }

    /**
     * ユーザーの見積もりを取得
     * 
     * @param string $userId
     * @return Collection
     */
    public function getByUser(string $userId): Collection
    {
        return Quote::where('user_id', $userId)
            ->with($this->getDefaultRelations())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * 会社の見積もりを取得
     * 
     * @param string $companyId
     * @return Collection
     */
    public function getByCompany(string $companyId): Collection
    {
        return Quote::where('company_id', $companyId)
            ->with($this->getDefaultRelations())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * 次の見積番号を生成
     * 
     * @return string
     */
    public function generateQuoteNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $prefix = "Q{$year}{$month}";

        // 今月の最新の見積番号を取得
        $latestQuote = Quote::where('quote_number', 'like', "{$prefix}%")
            ->orderBy('quote_number', 'desc')
            ->first();

        if ($latestQuote) {
            // 最後の4桁を取得してインクリメント
            $lastNumber = (int) substr($latestQuote->quote_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s%04d', $prefix, $newNumber);
    }

    /**
     * フィルタ条件でクエリビルダーを取得（オーバーライド）
     * 
     * @param array $filters
     * @return Builder
     */
    public function findWithFilters(array $filters): Builder
    {
        // 親クラスの基本フィルタを適用
        $query = parent::findWithFilters($filters);

        // ユーザーフィルター
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // 会社フィルター
        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        // 金額範囲フィルター
        if (!empty($filters['min_amount'])) {
            $query->where('total_amount', '>=', $filters['min_amount']);
        }
        if (!empty($filters['max_amount'])) {
            $query->where('total_amount', '<=', $filters['max_amount']);
        }

        // 送信日フィルター
        if (!empty($filters['sent_from'])) {
            $query->where('sent_at', '>=', $filters['sent_from']);
        }
        if (!empty($filters['sent_to'])) {
            $query->where('sent_at', '<=', $filters['sent_to']);
        }

        // 有効期限フィルター
        if (isset($filters['expired'])) {
            if ($filters['expired'] === 'yes') {
                $query->where('expires_at', '<', now());
            } elseif ($filters['expired'] === 'no') {
                $query->where('expires_at', '>=', now());
            }
        }

        return $query;
    }

    /**
     * 統計情報を取得（オーバーライド）
     * 
     * @return array
     */
    public function getStats(): array
    {
        $stats = parent::getStats();

        // Quote固有の統計を追加
        $stats['by_status'] = Quote::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // total_amountはQuoteVersionテーブルに保存されているため、そこから取得
        $stats['total_amount'] = QuoteVersion::sum('total_amount');
        $stats['average_amount'] = QuoteVersion::avg('total_amount');

        return $stats;
    }
}
