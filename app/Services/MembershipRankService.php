<?php

namespace App\Services;

use App\Models\Company;
use App\Models\CompanyMembership;
use App\Models\MembershipRank;
use App\Models\Receipt;
use App\Repositories\MembershipRankRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MembershipRankService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(MembershipRankRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'MembershipRank';
    }

    /**
     * 会員ランクを作成
     */
    public function createMembershipRank(array $data): MembershipRank
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();
            return $this->repository->create($data);
        });
    }

    /**
     * 会員ランクを更新
     */
    public function updateMembershipRank(MembershipRank $membershipRank, array $data): MembershipRank
    {
        return DB::transaction(function () use ($membershipRank, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($membershipRank, $data);
        });
    }

    /**
     * 会員ランクを削除
     */
    public function deleteMembershipRank(MembershipRank $membershipRank): bool
    {
        return DB::transaction(function () use ($membershipRank) {
            return $this->repository->delete($membershipRank);
        });
    }

    /**
     * 会社の当年（暦年）の利用額を集計し、該当するランクを反映する
     */
    public function recalculateForCompany(Company $company): void
    {
        $annualAmount = Receipt::where('company_id', $company->id)
            ->whereYear('issued_at', now()->year)
            ->sum('total_amount');

        $rank = MembershipRank::active()
            ->where('min_annual_amount', '<=', $annualAmount)
            ->orderByDesc('min_annual_amount')
            ->first();

        $membership = CompanyMembership::firstOrCreate(['company_id' => $company->id]);

        $membership->update([
            'annual_usage_amount' => $annualAmount,
            'current_rank_id' => $rank?->id,
            'rank_calculated_at' => now(),
        ]);
    }
}
