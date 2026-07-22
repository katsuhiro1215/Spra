<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PointRewardRequest;
use App\Models\PointReward;
use App\Services\PointRewardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PointRewardController extends Controller
{
    public function __construct(
        private PointRewardService $pointRewardService
    ) {}

    /**
     * ポイント特典一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'is_active' => $request->input('is_active'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $pointRewards = $this->pointRewardService->getPaginated($filters, $sort, 20);
        $stats = $this->pointRewardService->getStats();

        return Inertia::render('Admin/PointReward/Index', [
            'pointRewards' => $pointRewards,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/PointReward/Create');
    }

    /**
     * 保存
     */
    public function store(PointRewardRequest $request): RedirectResponse
    {
        try {
            $this->pointRewardService->createPointReward($request->validated());

            return redirect()->route('admin.point-reward.index')
                ->with('success', __('messages.created', ['attribute' => 'ポイント特典']));
        } catch (\Exception $e) {
            Log::error('PointReward store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'ポイント特典']));
        }
    }

    /**
     * 編集フォーム
     */
    public function edit(PointReward $pointReward): Response
    {
        return Inertia::render('Admin/PointReward/Edit', [
            'pointReward' => $pointReward,
        ]);
    }

    /**
     * 更新
     */
    public function update(PointRewardRequest $request, PointReward $pointReward): RedirectResponse
    {
        try {
            $this->pointRewardService->updatePointReward($pointReward, $request->validated());

            return redirect()->route('admin.point-reward.index')
                ->with('success', __('messages.updated', ['attribute' => 'ポイント特典']));
        } catch (\Exception $e) {
            Log::error('PointReward update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'ポイント特典']));
        }
    }

    /**
     * 削除
     */
    public function destroy(PointReward $pointReward): RedirectResponse
    {
        try {
            $this->pointRewardService->deletePointReward($pointReward);

            return redirect()->route('admin.point-reward.index')
                ->with('success', __('messages.deleted', ['attribute' => 'ポイント特典']));
        } catch (\Exception $e) {
            Log::error('PointReward destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
