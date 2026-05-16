<?php

namespace App\Repositories\Contracts;

/**
 * レスポンステンプレートリポジトリインターフェース
 * 
 * SoftDeletableRepositoryInterfaceを継承し、ResponseTemplate固有のメソッドを追加
 */
interface ResponseTemplateRepositoryInterface extends SoftDeletableRepositoryInterface
{
    /**
     * カテゴリで取得
     * 
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByCategory(string $category);

    /**
     * 有効なテンプレートを取得
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActive();
}
