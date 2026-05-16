<?php

namespace App\Repositories;

use App\Models\ResponseTemplate;
use App\Repositories\Contracts\ResponseTemplateRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ResponseTemplateRepository extends SoftDeletableRepository implements ResponseTemplateRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return ResponseTemplate::class;
    }

    /**
     * 検索対象フィールドを返す
     * 
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return [
            'name',
            'category',
            'subject',
            'body',
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
            'name',
            'status',
            'sort_order',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return ['creator', 'updater'];
    }

    /**
     * カテゴリで取得
     * 
     * @param string $category
     * @return Collection
     */
    public function getByCategory(string $category): Collection
    {
        return ResponseTemplate::where('category', $category)
            ->where('status', 'active')
            ->ordered()
            ->get();
    }

    /**
     * 有効なテンプレートを取得
     * 
     * @return Collection
     */
    public function getActive(): Collection
    {
        return ResponseTemplate::where('status', 'active')
            ->ordered()
            ->get();
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
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->ordered();
    }
}
