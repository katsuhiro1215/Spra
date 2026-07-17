<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampaignRequest;
use App\Models\Campaign;
use App\Services\CampaignService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function __construct(
        private CampaignService $campaignService
    ) {}

    /**
     * キャンペーン一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'is_active' => $request->input('is_active'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'starts_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $campaigns = $this->campaignService->getPaginated($filters, $sort, 20);
        $stats = $this->campaignService->getStats();
        $calendarCampaigns = $this->campaignService->getForCalendar();

        return Inertia::render('Admin/Campaign/Index', [
            'campaigns' => $campaigns,
            'stats' => $stats,
            'filters' => $filters,
            'calendarCampaigns' => $calendarCampaigns,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Campaign/Create', [
            'discountTypes' => Campaign::DISCOUNT_TYPES,
        ]);
    }

    /**
     * 保存
     */
    public function store(CampaignRequest $request): RedirectResponse
    {
        try {
            $this->campaignService->createCampaign($request->validated());

            return redirect()->route('admin.campaign.index')
                ->with('success', 'キャンペーンを作成しました。');
        } catch (\Exception $e) {
            Log::error('Campaign store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'キャンペーンの作成に失敗しました。');
        }
    }

    /**
     * 詳細表示
     */
    public function show(Campaign $campaign): Response
    {
        return Inertia::render('Admin/Campaign/Show', [
            'campaign' => $campaign,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Campaign $campaign): Response
    {
        return Inertia::render('Admin/Campaign/Edit', [
            'campaign' => $campaign,
            'discountTypes' => Campaign::DISCOUNT_TYPES,
        ]);
    }

    /**
     * 更新
     */
    public function update(CampaignRequest $request, Campaign $campaign): RedirectResponse
    {
        try {
            $this->campaignService->updateCampaign($campaign, $request->validated());

            return redirect()->route('admin.campaign.index')
                ->with('success', 'キャンペーンを更新しました。');
        } catch (\Exception $e) {
            Log::error('Campaign update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'キャンペーンの更新に失敗しました。');
        }
    }

    /**
     * 削除
     */
    public function destroy(Campaign $campaign): RedirectResponse
    {
        try {
            $this->campaignService->deleteCampaign($campaign);

            return redirect()->route('admin.campaign.index')
                ->with('success', 'キャンペーンを削除しました。');
        } catch (\Exception $e) {
            Log::error('Campaign destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
