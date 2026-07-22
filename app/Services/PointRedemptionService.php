<?php

namespace App\Services;

use App\Models\CompanyMembership;
use App\Models\PointCatalogItem;
use App\Models\PointRedemption;
use Illuminate\Support\Facades\DB;

class PointRedemptionService
{
    public function __construct(
        private PointService $pointService,
    ) {}

    /**
     * クライアントからのポイント交換申請を作成
     */
    public function createRequest(string $companyId, string $catalogItemId, string $requestedByUserId): PointRedemption
    {
        $item = PointCatalogItem::active()->findOrFail($catalogItemId);

        $membership = CompanyMembership::where('company_id', $companyId)->first();

        if (!$membership || $membership->points_balance < $item->points_cost) {
            throw new \Exception('ポイント残高が不足しています。');
        }

        return PointRedemption::create([
            'company_id' => $companyId,
            'point_catalog_item_id' => $item->id,
            'item_name' => $item->name,
            'points_used' => $item->points_cost,
            'status' => 'pending',
            'requested_by' => $requestedByUserId,
        ]);
    }

    /**
     * 交換申請を承認し、ポイントを消費する
     */
    public function approve(PointRedemption $redemption, string $adminId): PointRedemption
    {
        if ($redemption->status !== 'pending') {
            throw new \Exception('申請中の交換のみ承認できます。');
        }

        return DB::transaction(function () use ($redemption, $adminId) {
            $this->pointService->consumePoints(
                $redemption->company_id,
                $redemption->points_used,
                "ポイント交換: {$redemption->item_name}",
                ['redemption_id' => $redemption->id],
            );

            $redemption->update([
                'status' => 'approved',
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            return $redemption->fresh();
        });
    }

    /**
     * 交換申請を却下する（ポイントは消費しない）
     */
    public function reject(PointRedemption $redemption, string $adminId, ?string $reason = null): PointRedemption
    {
        if ($redemption->status !== 'pending') {
            throw new \Exception('申請中の交換のみ却下できます。');
        }

        $redemption->update([
            'status' => 'rejected',
            'reviewed_by' => $adminId,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $redemption->fresh();
    }
}
