<?php

namespace App\Repositories;

use App\Models\ServiceCategory;
use App\Repositories\Contracts\ServiceCategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ServiceCategoryRepository extends SoftDeletableRepository implements ServiceCategoryRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return ServiceCategory::class;
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
            'slug',
            'description',
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
            'status',
        ];
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

        return $query;
    }

    public function getStats(): array
    {
        $baseStats = parent::getStats();

        return array_merge($baseStats, [
            'total' => ServiceCategory::count(),
            'active' => ServiceCategory::where('status', 'active')->count(),
            'inactive' => ServiceCategory::where('status', 'inactive')->count(),
            'suspended' => ServiceCategory::where('status', 'suspended')->count(),
        ]);
    }
}
