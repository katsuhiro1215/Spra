<?php

namespace App\Services;

use App\Models\Referral;
use App\Repositories\ReferralRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReferralService extends BaseService
{
    public function __construct(
        ReferralRepository $repository,
        private PointService $pointService,
    ) {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'Referral';
    }

    /**
     * 紹介を作成（紹介コードは自動採番）
     */
    public function createReferral(array $data): Referral
    {
        return DB::transaction(function () use ($data) {
            $data['referral_code'] = $this->generateReferralCode();
            $data['status'] = 'pending';
            $data['created_by'] = Auth::guard('admins')->id();

            return $this->repository->create($data);
        });
    }

    /**
     * 紹介を更新
     */
    public function updateReferral(Referral $referral, array $data): Referral
    {
        return DB::transaction(function () use ($referral, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($referral, $data);
        });
    }

    /**
     * 紹介を削除
     */
    public function deleteReferral(Referral $referral): bool
    {
        return DB::transaction(function () use ($referral) {
            return $this->repository->delete($referral);
        });
    }

    /**
     * 紹介を「成立」にし、紹介者・被紹介者双方にポイントを付与する
     * 冪等: 既に付与済みの側は再付与しない
     */
    public function markContracted(Referral $referral): Referral
    {
        if (!$referral->referred_company_id) {
            throw new \Exception('被紹介企業が未設定のため成立にできません。先に被紹介企業を設定してください。');
        }

        return DB::transaction(function () use ($referral) {
            if ($referral->status !== 'contracted') {
                $referral->update([
                    'status' => 'contracted',
                    'contracted_at' => now(),
                ]);
            }

            if (!$referral->referrer_rewarded_at) {
                $transaction = $this->pointService->grantReward(
                    $referral->referrer_company_id,
                    'referral_referrer',
                    ['type' => 'referral', 'referral_id' => $referral->id],
                );

                if ($transaction) {
                    $referral->update([
                        'referrer_points' => $transaction->points,
                        'referrer_rewarded_at' => now(),
                    ]);
                }
            }

            if (!$referral->referred_rewarded_at) {
                $transaction = $this->pointService->grantReward(
                    $referral->referred_company_id,
                    'referral_referred',
                    ['type' => 'referral', 'referral_id' => $referral->id],
                );

                if ($transaction) {
                    $referral->update([
                        'referred_points' => $transaction->points,
                        'referred_rewarded_at' => now(),
                    ]);
                }
            }

            return $referral->fresh();
        });
    }

    /**
     * 紹介コードを生成（重複しないまでリトライ）
     */
    private function generateReferralCode(): string
    {
        do {
            $code = Str::upper(Str::random(8));
        } while (Referral::withTrashed()->where('referral_code', $code)->exists());

        return $code;
    }
}
