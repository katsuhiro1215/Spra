<?php

namespace App\Repositories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;

class PostRepository extends SoftDeletableRepository
{
    /**
     * モデルクラス名を返す
     */
    protected function getModelClass(): string
    {
        return Post::class;
    }

    /**
     * 検索対象フィールドを返す
     */
    protected function getSearchableFields(): array
    {
        return [
            'title',
            'excerpt',
        ];
    }

    /**
     * ソート可能フィールドを返す
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'published_at',
            'is_published',
            'title',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     */
    protected function getDefaultRelations(): array
    {
        return ['createdBy', 'postCategory'];
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

        // カテゴリフィルター
        if (!empty($filters['category_id'])) {
            $query->where('post_category_id', $filters['category_id']);
        }

        // 作成者フィルター
        if (!empty($filters['author_id'])) {
            $query->where('created_by', $filters['author_id']);
        }

        return $query;
    }

    /**
     * ステータスフィルタを適用（オーバーライド：is_published カラムを使用）
     */
    public function buildStatusFilter(Builder $query, string $status): Builder
    {
        return $query->where('is_published', $status === 'published');
    }

    /**
     * 統計情報を取得
     */
    public function getStats(): array
    {
        return [
            'total' => Post::withTrashed()->count(),
            'active' => Post::count(),
            'trashed' => Post::onlyTrashed()->count(),
            'published' => Post::where('is_published', true)->count(),
            'draft' => Post::where('is_published', false)->count(),
        ];
    }
}
