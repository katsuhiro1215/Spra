<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * 基底リポジトリインターフェース
 * 
 * 全てのリポジトリが実装すべき基本的なCRUD操作とクエリ機能を定義
 */
interface BaseRepositoryInterface
{
    /**
     * ベースクエリビルダーを取得
     * 
     * @return Builder
     */
    public function query(): Builder;

    /**
     * IDで単一レコードを検索
     * 
     * @param string $id
     * @return mixed|null
     */
    public function findById(string $id): mixed;

    /**
     * フィルタ条件でクエリビルダーを取得
     * 
     * @param array $filters
     * @return Builder
     */
    public function findWithFilters(array $filters): Builder;

    /**
     * ページネーション付きでレコードを取得
     * 
     * @param int $perPage ページあたりのレコード数
     * @param array $filters フィルタ条件
     * @param array $sort ソート条件 ['field' => string, 'direction' => 'asc'|'desc']
     * @return LengthAwarePaginator
     */
    public function paginate(
        int $perPage = 20,
        array $filters = [],
        array $sort = []
    ): LengthAwarePaginator;

    /**
     * 検索クエリを適用
     * 
     * @param Builder $query
     * @param string $search 検索キーワード
     * @return Builder
     */
    public function buildSearchQuery(Builder $query, string $search): Builder;

    /**
     * ステータスフィルタを適用
     * 
     * @param Builder $query
     * @param string $status ステータス値
     * @return Builder
     */
    public function buildStatusFilter(Builder $query, string $status): Builder;

    /**
     * ソートを適用
     * 
     * @param Builder $query
     * @param string $field ソート対象フィールド
     * @param string $direction ソート方向 ('asc'|'desc')
     * @return Builder
     */
    public function applySorting(
        Builder $query,
        string $field,
        string $direction = 'desc'
    ): Builder;

    /**
     * 新規レコードを作成
     * 
     * @param array $data 作成データ
     * @return mixed
     */
    public function create(array $data): mixed;

    /**
     * レコードを更新
     * 
     * @param mixed $model 更新対象モデル
     * @param array $data 更新データ
     * @return mixed
     */
    public function update(mixed $model, array $data): mixed;

    /**
     * レコードを削除
     * 
     * @param mixed $model 削除対象モデル
     * @return bool
     */
    public function delete(mixed $model): bool;

    /**
     * 統計情報を取得
     * 
     * @return array
     */
    public function getStats(): array;
}
