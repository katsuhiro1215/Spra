<?php

namespace App\Repositories\Contracts;

use App\Models\Quote;

/**
 * 見積もりリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、Quote固有のメソッドを追加
 */
interface QuoteRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * 見積番号で検索
     * 
     * @param string $quoteNumber
     * @return Quote|null
     */
    public function findByQuoteNumber(string $quoteNumber): ?Quote;

    /**
     * ユーザーの見積もりを取得
     * 
     * @param string $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByUser(string $userId);

    /**
     * 会社の見積もりを取得
     * 
     * @param string $companyId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByCompany(string $companyId);

    /**
     * 次の見積番号を生成
     * 
     * @return string
     */
    public function generateQuoteNumber(): string;
}
