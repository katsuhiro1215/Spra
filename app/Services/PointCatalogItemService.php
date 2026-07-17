<?php

namespace App\Services;

use App\Models\PointCatalogItem;
use App\Repositories\PointCatalogItemRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PointCatalogItemService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(PointCatalogItemRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'PointCatalogItem';
    }

    /**
     * カタログ商品を作成
     */
    public function createPointCatalogItem(array $data): PointCatalogItem
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();
            return $this->repository->create($data);
        });
    }

    /**
     * カタログ商品を更新
     */
    public function updatePointCatalogItem(PointCatalogItem $pointCatalogItem, array $data): PointCatalogItem
    {
        return DB::transaction(function () use ($pointCatalogItem, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($pointCatalogItem, $data);
        });
    }

    /**
     * カタログ商品を削除
     */
    public function deletePointCatalogItem(PointCatalogItem $pointCatalogItem): bool
    {
        return DB::transaction(function () use ($pointCatalogItem) {
            return $this->repository->delete($pointCatalogItem);
        });
    }
}
