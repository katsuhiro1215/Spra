<?php

namespace App\Services;

use App\Models\CompanyMembership;
use App\Models\PointReward;
use App\Models\PointTransaction;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PointService
{
    /**
     * 入金確認（Receipt発行）時に通常ポイントを付与
     * 110円(税込) = 1ポイント
     */
    public function grantForReceipt(Receipt $receipt): ?PointTransaction
    {
        if (!$receipt->company_id) {
            Log::info('Receiptに company_id が無いためポイント付与をスキップしました', [
                'receipt_id' => $receipt->id,
            ]);
            return null;
        }

        $points = intdiv((int) round((float) $receipt->total_amount), 110);

        if ($points <= 0) {
            return null;
        }

        return $this->createTransaction(
            companyId: $receipt->company_id,
            points: $points,
            type: 'purchase',
            description: "ご入金（{$receipt->receipt_number}）",
            receiptId: $receipt->id,
        );
    }

    /**
     * PointRewardマスタのルールに基づいてボーナス/紹介ポイントを付与
     */
    public function grantReward(string $companyId, string $rewardCode, array $context = []): ?PointTransaction
    {
        $reward = PointReward::active()->where('code', $rewardCode)->first();

        if (!$reward) {
            Log::warning('PointRewardが見つからないか無効なため付与をスキップしました', [
                'company_id' => $companyId,
                'reward_code' => $rewardCode,
            ]);
            return null;
        }

        return $this->createTransaction(
            companyId: $companyId,
            points: $reward->points,
            type: $context['type'] ?? 'bonus',
            description: $reward->name,
            pointRewardId: $reward->id,
            referralId: $context['referral_id'] ?? null,
        );
    }

    /**
     * ポイントカタログ交換の承認時にポイントを消費する
     * $points は正の値で受け取り、台帳にはマイナス値として記録する
     */
    public function consumePoints(string $companyId, int $points, string $description, array $context = []): PointTransaction
    {
        if ($points <= 0) {
            throw new \InvalidArgumentException('消費ポイント数は正の値で指定してください。');
        }

        return DB::transaction(function () use ($companyId, $points, $description, $context) {
            $membership = CompanyMembership::where('company_id', $companyId)->lockForUpdate()->first();

            if (!$membership || $membership->points_balance < $points) {
                throw new \Exception('ポイント残高が不足しています。');
            }

            return $this->createTransaction(
                companyId: $companyId,
                points: -$points,
                type: 'redemption',
                description: $description,
                redemptionId: $context['redemption_id'] ?? null,
                membership: $membership,
            );
        });
    }

    /**
     * 台帳への記帳と残高更新を1トランザクションで行う
     */
    private function createTransaction(
        string $companyId,
        int $points,
        string $type,
        string $description,
        ?string $receiptId = null,
        ?string $pointRewardId = null,
        ?string $referralId = null,
        ?string $redemptionId = null,
        ?CompanyMembership $membership = null,
    ): PointTransaction {
        return DB::transaction(function () use ($companyId, $points, $type, $description, $receiptId, $pointRewardId, $referralId, $redemptionId, $membership) {
            $membership ??= CompanyMembership::where('company_id', $companyId)->lockForUpdate()->first();

            if (!$membership) {
                $membership = CompanyMembership::create([
                    'company_id' => $companyId,
                    'points_balance' => 0,
                    'lifetime_points' => 0,
                ]);
            }

            $balanceAfter = $membership->points_balance + $points;

            $transaction = PointTransaction::create([
                'company_id' => $companyId,
                'points' => $points,
                'type' => $type,
                'point_reward_id' => $pointRewardId,
                'receipt_id' => $receiptId,
                'referral_id' => $referralId,
                'redemption_id' => $redemptionId,
                'description' => $description,
                'balance_after' => $balanceAfter,
                'created_by' => Auth::guard('admins')->id(),
            ]);

            $membership->increment('points_balance', $points);
            $membership->increment('lifetime_points', max($points, 0));

            return $transaction;
        });
    }
}
