<?php

namespace App\Repositories;

use App\Models\Page;
use Illuminate\Database\Eloquent\Builder;

class PageRepository extends SoftDeletableRepository
{
    /**
     * モデルクラス名を返す
     */
    protected function getModelClass(): string
    {
        return Page::class;
    }

    /**
     * 検索対象フィールドを返す
     */
    protected function getSearchableFields(): array
    {
        return [
            'title',
            'slug',
        ];
    }

    /**
     * ソート可能フィールドを返す
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'sort_order',
            'is_published',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     */
    protected function getDefaultRelations(): array
    {
        return [];
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

        // 公開ステータスフィルター
        if (isset($filters['is_published'])) {
            $query->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query;
    }

    /**
     * 統計情報を取得
     */
    public function getStats(): array
    {
        return [
            'total' => Page::withTrashed()->count(),
            'active' => Page::count(),
            'trashed' => Page::onlyTrashed()->count(),
            'published' => Page::where('is_published', true)->count(),
        ];
    }
}
