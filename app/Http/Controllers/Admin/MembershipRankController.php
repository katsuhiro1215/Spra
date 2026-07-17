<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MembershipRankRequest;
use App\Models\MembershipRank;
use App\Services\MembershipRankService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class MembershipRankController extends Controller
{
    public function __construct(
        private MembershipRankService $membershipRankService
    ) {}

    /**
     * 会員ランク一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'is_active' => $request->input('is_active'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $membershipRanks = $this->membershipRankService->getPaginated($filters, $sort, 20);
        $stats = $this->membershipRankService->getStats();

        return Inertia::render('Admin/MembershipRank/Index', [
            'membershipRanks' => $membershipRanks,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/MembershipRank/Create');
    }

    /**
     * 保存
     */
    public function store(MembershipRankRequest $request): RedirectResponse
    {
        try {
            $this->membershipRankService->createMembershipRank($request->validated());

            return redirect()->route('admin.membership-rank.index')
                ->with('success', '会員ランクを作成しました。');
        } catch (\Exception $e) {
            Log::error('MembershipRank store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', '会員ランクの作成に失敗しました。');
        }
    }

    /**
     * 編集フォーム
     */
    public function edit(MembershipRank $membershipRank): Response
    {
        return Inertia::render('Admin/MembershipRank/Edit', [
            'membershipRank' => $membershipRank,
        ]);
    }

    /**
     * 更新
     */
    public function update(MembershipRankRequest $request, MembershipRank $membershipRank): RedirectResponse
    {
        try {
            $this->membershipRankService->updateMembershipRank($membershipRank, $request->validated());

            return redirect()->route('admin.membership-rank.index')
                ->with('success', '会員ランクを更新しました。');
        } catch (\Exception $e) {
            Log::error('MembershipRank update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', '会員ランクの更新に失敗しました。');
        }
    }

    /**
     * 削除
     */
    public function destroy(MembershipRank $membershipRank): RedirectResponse
    {
        try {
            $this->membershipRankService->deleteMembershipRank($membershipRank);

            return redirect()->route('admin.membership-rank.index')
                ->with('success', '会員ランクを削除しました。');
        } catch (\Exception $e) {
            Log::error('MembershipRank destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
