<?php

namespace App\Services;

use App\Models\PointReward;
use App\Repositories\PointRewardRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PointRewardService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(PointRewardRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'PointReward';
    }

    /**
     * ポイント特典を作成
     */
    public function createPointReward(array $data): PointReward
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();
            return $this->repository->create($data);
        });
    }

    /**
     * ポイント特典を更新
     */
    public function updatePointReward(PointReward $pointReward, array $data): PointReward
    {
        return DB::transaction(function () use ($pointReward, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($pointReward, $data);
        });
    }

    /**
     * ポイント特典を削除
     */
    public function deletePointReward(PointReward $pointReward): bool
    {
        return DB::transaction(function () use ($pointReward) {
            return $this->repository->delete($pointReward);
        });
    }

    /**
     * 手動付与フォーム等で使う、有効な特典一覧を取得
     */
    public function getActiveForSelect(): \Illuminate\Support\Collection
    {
        return PointReward::active()->orderBy('name')->get(['id', 'code', 'name', 'points']);
    }
}
