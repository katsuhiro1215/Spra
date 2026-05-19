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

    /**
     * 見積もり作成用にアクティブなServiceItemを取得（カテゴリ別グループ化）
     * 
     * @return \Illuminate\Support\Collection
     */
    public function getActiveForQuote()
    {
        return $this->repository->query()
            ->with(['service.serviceCategory', 'servicePlan'])
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get()
            ->groupBy('service.service_category_id');
    }

    /**
     * 特定のサービスに紐づくアクティブなServiceItemを取得
     * 
     * @param string $serviceId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveByService(string $serviceId)
    {
        return $this->repository->query()
            ->with(['servicePlan'])
            ->where('service_id', $serviceId)
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    /**
     * 特定のカテゴリに紐づくアクティブなServiceItemを取得
     * 
     * @param string $categoryId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveByCategory(string $categoryId)
    {
        return $this->repository->query()
            ->with(['service', 'servicePlan'])
            ->whereHas('service', function ($query) use ($categoryId) {
                $query->where('service_category_id', $categoryId);
            })
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();
    }
}
