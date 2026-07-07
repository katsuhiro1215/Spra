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
            ['value' => 'active', 'label' => '有効'],
            ['value' => 'inactive', 'label' => '無効'],
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
            ['value' => 'plan_base', 'label' => 'プラン基本料金'],
            ['value' => 'included', 'label' => 'プラン含まれる項目'],
            ['value' => 'optional', 'label' => 'プラン固有オプション'],
            ['value' => 'addon', 'label' => '全プラン共通オプション'],
        ];
    }

    /**
     * 見積もり作成用にアクティブなServiceItemを取得（カテゴリ別グループ化）
     * 
     * @return array
     */
    public function getActiveForQuote()
    {
        $items = $this->repository->query()
            ->with(['service.serviceCategory', 'servicePlans'])
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();

        // フロントエンド用にservicePlanを単数形で追加
        $items->each(function ($item) {
            $item->servicePlan = $item->servicePlans?->first();
            // シリアライズのため、不要なリレーションを非表示に
            $item->makeHidden('servicePlans');
        });

        // カテゴリ別にグループ化して配列で返す
        return $items->groupBy(function ($item) {
            return $item->service['service_category_id'];
        })->toArray();
    }

    /**
     * 特定のサービスに紐づくアクティブなServiceItemを取得
     * 
     * @param string $serviceId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveByService(string $serviceId)
    {
        $items = $this->repository->query()
            ->with(['servicePlans'])
            ->where('service_id', $serviceId)
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();

        // フロントエンド用にservicePlanを単数形で追加
        $items->each(function ($item) {
            $item->servicePlan = $item->servicePlans?->first();
        });

        return $items;
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
            ->with(['service'])
            ->whereHas('service', function ($query) use ($categoryId) {
                $query->where('service_category_id', $categoryId);
            })
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();
    }
}
