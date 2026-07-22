<?php

namespace App\Repositories;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ServiceRepository extends SoftDeletableRepository implements ServiceRepositoryInterface
{
    /**
     * モデルクラス名を返す
     * 
     * @return string
     */
    protected function getModelClass(): string
    {
        return Service::class;
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
            'serviceCategory.name',
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
            'sort_order',
            'created_at',
            'updated_at',
            'name',
            'status',
        ];
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
     * デフォルトのリレーションを返す
     * 
     * @return array
     */
    protected function getDefaultRelations(): array
    {
        return ['serviceCategory', 'creator', 'updater'];
    }

    /**
     * スラッグで検索
     * 
     * @param string $slug
     * @return Service|null
     */
    public function findBySlug(string $slug): ?Service
    {
        return $this->query()->where('slug', $slug)->first();
    }

    /**
     * スラッグが存在するか確認
     * 
     * @param string $slug
     * @param string|null $excludeId
     * @return bool
     */
    public function slugExists(string $slug, ?string $excludeId = null): bool
    {
        $query = Service::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
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
        if (!empty($filters['service_category_id'])) {
            $query->where('service_category_id', $filters['service_category_id']);
        }

        // おすすめフィルター
        if (isset($filters['is_featured'])) {
            $query->where('is_featured', (bool) $filters['is_featured']);
        }

        return $query;
    }
}
