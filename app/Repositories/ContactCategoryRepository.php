<?php

namespace App\Repositories;

use App\Models\ContactCategory;

class ContactCategoryRepository extends BaseRepository
{
    /**
     * モデルクラス名を返す
     *
     * @return string
     */
    protected function getModelClass(): string
    {
        return ContactCategory::class;
    }

    /**
     * 検索対象フィールドを返す
     *
     * @return array
     */
    protected function getSearchableFields(): array
    {
        return ['name', 'description'];
    }

    /**
     * ソート可能フィールドを返す
     *
     * @return array
     */
    protected function getSortableFields(): array
    {
        return ['sort_order', 'name', 'created_at', 'is_active'];
    }

    /**
     * デフォルトのソートフィールドを返す
     *
     * @return string
     */
    protected function getDefaultSortField(): string
    {
        return 'sort_order';
    }

    /**
     * 相互にソートされたアクティブなカテゴリを取得
     */
    public function getActive()
    {
        return $this->query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
    /**
     * 統計情報を取得
     *
     * @return array
     */
    public function getStats(): array
    {
        $modelClass = $this->getModelClass();

        return [
            'total' => $modelClass::count(),
            'active' => $modelClass::where('is_active', true)->count(),
            'inactive' => $modelClass::where('is_active', false)->count(),
        ];
    }
}
