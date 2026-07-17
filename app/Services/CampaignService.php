<?php

namespace App\Services;

use App\Models\Campaign;
use App\Repositories\CampaignRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CampaignService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(CampaignRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'Campaign';
    }

    /**
     * キャンペーンを作成
     */
    public function createCampaign(array $data): Campaign
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();
            return $this->repository->create($data);
        });
    }

    /**
     * キャンペーンを更新
     */
    public function updateCampaign(Campaign $campaign, array $data): Campaign
    {
        return DB::transaction(function () use ($campaign, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($campaign, $data);
        });
    }

    /**
     * キャンペーンを削除
     */
    public function deleteCampaign(Campaign $campaign): bool
    {
        return DB::transaction(function () use ($campaign) {
            return $this->repository->delete($campaign);
        });
    }

    /**
     * 見積もり選択用に、現在進行中のキャンペーンを取得
     */
    public function getActiveForSelect(): \Illuminate\Support\Collection
    {
        return Campaign::currentlyRunning()
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'discount_type', 'discount_value']);
    }

    /**
     * カレンダー表示用に、全キャンペーンを軽量な形で取得
     */
    public function getForCalendar(): \Illuminate\Support\Collection
    {
        return Campaign::orderBy('starts_at')
            ->get(['id', 'name', 'code', 'starts_at', 'ends_at', 'is_active'])
            ->map(fn(Campaign $campaign) => [
                'id' => $campaign->id,
                'name' => $campaign->name,
                'code' => $campaign->code,
                'starts_at' => $campaign->starts_at,
                'ends_at' => $campaign->ends_at,
                'status_label' => $campaign->status_label,
            ]);
    }
}
