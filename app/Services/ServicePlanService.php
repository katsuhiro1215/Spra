<?php

namespace App\Services;

use App\Models\ServicePlan;
use App\Repositories\ServicePlanRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServicePlanService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param ServicePlanRepository $repository
     */
    public function __construct(ServicePlanRepository $repository)
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
        return 'ServicePlan';
    }

    /**
     * スラッグでサービスプランを検索
     * 
     * @param string $slug
     * @return ServicePlan|null
     */
    public function findServicePlanBySlug(string $slug): ?ServicePlan
    {
        return $this->repository->findBySlug($slug);
    }

    /**
     * 新しいサービスプランを作成
     * 
     * @param array $data
     * @return ServicePlan
     * @throws \Exception
     */
    public function createServicePlan(array $data): ServicePlan
    {
        return DB::transaction(function () use ($data) {
            // スラッグ生成
            if (empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name']);
            } else {
                // 既存のslugがある場合は重複チェック
                if ($this->repository->slugExists($data['slug'])) {
                    $data['slug'] = $this->generateUniqueSlug($data['name']);
                }
            }

            return $this->repository->create($data);
        });
    }

    /**
     * サービスプランを更新
     * 
     * @param ServicePlan $servicePlan
     * @param array $data
     * @return ServicePlan
     */
    public function updateServicePlan(ServicePlan $servicePlan, array $data): ServicePlan
    {
        return DB::transaction(function () use ($servicePlan, $data) {
            // スラッグの重複チェック（自分以外）
            if (!empty($data['slug']) && $data['slug'] !== $servicePlan->slug) {
                if ($this->repository->slugExists($data['slug'], $servicePlan->id)) {
                    $data['slug'] = $this->generateUniqueSlug($data['name'], $servicePlan->id);
                }
            }

            $this->repository->update($servicePlan, $data);

            return $servicePlan->fresh();
        });
    }

    /**
     * サービスプランを削除
     * 
     * @param ServicePlan $servicePlan
     * @throws \Exception
     */
    public function deleteServicePlan(ServicePlan $servicePlan): void
    {
        // 関連するServiceItemsがある場合は削除を防ぐ
        if ($servicePlan->serviceItems()->exists()) {
            throw new \Exception('このプランには関連するサービス項目があるため削除できません。');
        }

        DB::transaction(function () use ($servicePlan) {
            $this->repository->delete($servicePlan);
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
            'active' => '稼働中',
            'inactive' => '停止中',
            'suspended' => '一時停止',
        ];
    }

    /**
     * 支払いサイクル定義を取得
     * 
     * @return array
     */
    public function getBillingCycles(): array
    {
        return [
            'one_time' => '一回限り',
            'monthly' => '月額',
            'quarterly' => '四半期',
            'yearly' => '年額',
        ];
    }

    /**
     * セレクトボックス用にアクティブなサービスプランのみを取得（id/nameのみ）
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveForSelect()
    {
        return $this->repository->query()
            ->select('id', 'name', 'slug', 'service_id')
            ->where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    /**
     * 一意のスラッグを生成
     * 
     * @param string $name
     * @param string|null $excludeId
     * @return string
     */
    private function generateUniqueSlug(string $name, ?string $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->repository->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
