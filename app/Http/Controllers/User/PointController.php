<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CompanyMembership;
use App\Models\PointTransaction;
use Inertia\Inertia;
use Inertia\Response;

class PointController extends Controller
{
    /**
     * 自社のポイント残高・ランク・履歴
     */
    public function index(): Response
    {
        $user = auth('users')->user()->load('companies');
        $company = $user->companies->first();

        if (!$company) {
            return Inertia::render('User/Points/Index', [
                'membership' => null,
                'pointTransactions' => null,
            ]);
        }

        $membership = CompanyMembership::with('currentRank')
            ->where('company_id', $company->id)
            ->first();

        $pointTransactions = PointTransaction::where('company_id', $company->id)
            ->with(['pointReward', 'receipt', 'referral'])
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('User/Points/Index', [
            'membership' => $membership,
            'pointTransactions' => $pointTransactions,
        ]);
    }
}
