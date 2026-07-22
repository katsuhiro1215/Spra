<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CompanyMembership;
use App\Models\PointCatalogItem;
use App\Models\PointRedemption;
use App\Services\PointRedemptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PointRedemptionController extends Controller
{
    public function __construct(
        private PointRedemptionService $pointRedemptionService
    ) {}

    /**
     * ポイント交換カタログ・自社の申請履歴
     */
    public function index(): Response
    {
        $user = auth('users')->user()->load('companies');
        $company = $user->companies->first();

        $catalogItems = PointCatalogItem::active()->orderBy('sort_order')->get();

        if (!$company) {
            return Inertia::render('User/PointRedemptions/Index', [
                'catalogItems' => $catalogItems,
                'membership' => null,
                'redemptions' => [],
            ]);
        }

        $membership = CompanyMembership::where('company_id', $company->id)->first();

        $redemptions = PointRedemption::where('company_id', $company->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('User/PointRedemptions/Index', [
            'catalogItems' => $catalogItems,
            'membership' => $membership,
            'redemptions' => $redemptions,
        ]);
    }

    /**
     * 交換申請
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'point_catalog_item_id' => 'required|exists:point_catalog_items,id',
        ]);

        $user = auth('users')->user()->load('companies');
        $company = $user->companies->first();

        if (!$company) {
            return back()->with('error', '所属する会社が見つかりません。');
        }

        try {
            $this->pointRedemptionService->createRequest(
                $company->id,
                $validated['point_catalog_item_id'],
                $user->id,
            );

            return back()->with('success', '交換を申請しました。担当者の承認をお待ちください。');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
