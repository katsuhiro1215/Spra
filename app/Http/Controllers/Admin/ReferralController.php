<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReferralRequest;
use App\Models\Company;
use App\Models\Referral;
use App\Services\ReferralService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    public function __construct(
        private ReferralService $referralService
    ) {}

    /**
     * 紹介一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $referrals = $this->referralService->getPaginated($filters, $sort, 20);
        $stats = $this->referralService->getStats();

        return Inertia::render('Admin/Referral/Index', [
            'referrals' => $referrals,
            'stats' => $stats,
            'filters' => $filters,
            'statuses' => Referral::STATUSES,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Referral/Create', [
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * 保存
     */
    public function store(ReferralRequest $request): RedirectResponse
    {
        try {
            $this->referralService->createReferral($request->validated());

            return redirect()->route('admin.referral.index')
                ->with('success', '紹介を作成しました。');
        } catch (\Exception $e) {
            Log::error('Referral store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', '紹介の作成に失敗しました。');
        }
    }

    /**
     * 詳細表示
     */
    public function show(Referral $referral): Response
    {
        $referral->load(['referrerCompany', 'referredCompany', 'referredContact', 'transactions']);

        return Inertia::render('Admin/Referral/Show', [
            'referral' => $referral,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Referral $referral): Response
    {
        return Inertia::render('Admin/Referral/Edit', [
            'referral' => $referral,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * 更新
     */
    public function update(ReferralRequest $request, Referral $referral): RedirectResponse
    {
        try {
            $this->referralService->updateReferral($referral, $request->validated());

            return redirect()->route('admin.referral.index')
                ->with('success', '紹介を更新しました。');
        } catch (\Exception $e) {
            Log::error('Referral update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', '紹介の更新に失敗しました。');
        }
    }

    /**
     * 削除
     */
    public function destroy(Referral $referral): RedirectResponse
    {
        try {
            $this->referralService->deleteReferral($referral);

            return redirect()->route('admin.referral.index')
                ->with('success', '紹介を削除しました。');
        } catch (\Exception $e) {
            Log::error('Referral destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * 成立にする（紹介者・被紹介者双方へポイント付与）
     */
    public function markContracted(Referral $referral): RedirectResponse
    {
        try {
            $this->referralService->markContracted($referral);

            return redirect()->route('admin.referral.show', $referral->id)
                ->with('success', '紹介を成立にし、ポイントを付与しました。');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
