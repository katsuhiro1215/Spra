<?php

namespace App\Repositories;

use App\Models\ServiceItem;
use App\Repositories\Contracts\ServiceItemRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ServiceItemRepository extends SoftDeletableRepository implements ServiceItemRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return ServiceItem::class;
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
            'description',
            'item_type',
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
            'standard_price',
            'internal_cost',
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
        return ['service', 'servicePlans', 'creator', 'updater'];
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

        // サービスフィルター
        if (!empty($filters['service_id'])) {
            $query->where('service_id', $filters['service_id']);
        }

        // サービスプランフィルター
        if (!empty($filters['service_plan_id'])) {
            $query->where('service_plan_id', $filters['service_plan_id']);
        }

        // アイテムタイプフィルター
        if (!empty($filters['item_type'])) {
            $query->where('item_type', $filters['item_type']);
        }

        return $query;
    }
}
