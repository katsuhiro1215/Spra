<?php

namespace App\Services;

use App\Models\ServiceItem;
use App\Repositories\ServiceItemRepository;
use Illuminate\Support\Facades\DB;

class ServiceItemService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ServiceItemRepository $repository
     */
    public function __construct(ServiceItemRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     * 
     * @return string
     */
    protected function getEntityName(): string
    {
        return 'ServiceItem';
    }

    /**
     * 新しいサービスアイテムを作成
     * 
     * @param array $data
     * @return ServiceItem
     * @throws \Exception
     */
    public function createServiceItem(array $data): ServiceItem
    {
        return DB::transaction(function () use ($data) {
            return $this->repository->create($data);
        });
    }

    /**
     * サービスアイテムを更新
     * 
     * @param ServiceItem $serviceItem
     * @param array $data
     * @return ServiceItem
     */
    public function updateServiceItem(ServiceItem $serviceItem, array $data): ServiceItem
    {
        return DB::transaction(function () use ($serviceItem, $data) {
            $this->repository->update($serviceItem, $data);
            return $serviceItem->fresh();
        });
    }

    /**
     * サービスアイテムを削除
     * 
     * @param ServiceItem $serviceItem
     * @throws \Exception
     */
    public function deleteServiceItem(ServiceItem $serviceItem): void
    {
        DB::transaction(function () use ($serviceItem) {
            $this->repository->delete($serviceItem);
        });
    }

    /**
     * ステータス定義を取得
     * 
     * @return array
     */
    public function getStatuses(): array
    {
        return [
            'active' => '有効',
            'inactive' => '無効',
        ];
    }

    /**
     * アイテムタイプ定義を取得
     * 
     * @return array
     */
    public function getItemTypes(): array
    {
        return [
            'plan_base' => 'プラン基本料金',
            'included' => 'プラン含まれる項目',
            'optional' => 'プラン固有オプション',
            'addon' => '全プラン共通オプション',
        ];
    }
}
