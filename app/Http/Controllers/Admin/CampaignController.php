<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampaignRequest;
use App\Models\Campaign;
use App\Models\Media;
use App\Models\ServicePlan;
use App\Services\CampaignService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function __construct(
        private CampaignService $campaignService,
    ) {}

    /**
     * キャンペーンの対象プラン選択用に、サービス名付きでプラン一覧を取得
     */
    private function getServicePlansForForm(): Collection
    {
        return ServicePlan::where('status', 'active')
            ->with('service:id,name')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'service_id'])
            ->map(fn (ServicePlan $plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'service_id' => $plan->service_id,
                'service_name' => $plan->service?->name ?? '',
            ]);
    }

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
            'servicePlans' => $this->getServicePlansForForm(),
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
                ->with('success', __('messages.created', ['attribute' => 'キャンペーン']));
        } catch (\Exception $e) {
            Log::error('Campaign store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'キャンペーン']));
        }
    }

    /**
     * 詳細表示
     */
    public function show(Campaign $campaign): Response
    {
        $campaign->load(['media', 'applicablePlans:id,name,service_id', 'applicablePlans.service:id,name']);

        $mediaList = Media::where('type', 'image')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($media) => [
                'id' => $media->id,
                'title' => $media->title,
                'file_name' => $media->original_filename,
                'alt_text' => $media->alt_text,
                'url' => $media->url,
                'file_size' => $media->original_file_size,
            ]);

        return Inertia::render('Admin/Campaign/Show', [
            'campaign' => $campaign,
            'mediaList' => $mediaList,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Campaign $campaign): Response
    {
        $campaign->load(['applicablePlans:id,name,service_id', 'applicablePlans.service:id,name']);

        return Inertia::render('Admin/Campaign/Edit', [
            'campaign' => $campaign,
            'discountTypes' => Campaign::DISCOUNT_TYPES,
            'servicePlans' => $this->getServicePlansForForm(),
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
                ->with('success', __('messages.updated', ['attribute' => 'キャンペーン']));
        } catch (\Exception $e) {
            Log::error('Campaign update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'キャンペーン']));
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
                ->with('success', __('messages.deleted', ['attribute' => 'キャンペーン']));
        } catch (\Exception $e) {
            Log::error('Campaign destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * サムネイル画像を設定
     */
    public function attachMedia(Request $request, Campaign $campaign): RedirectResponse
    {
        $validated = $request->validate([
            'media_id' => ['required', 'exists:media,id'],
        ]);

        try {
            $campaign->update(['media_id' => $validated['media_id']]);

            return back()->with('success', __('messages.set', ['attribute' => 'サムネイル画像']));
        } catch (\Exception $e) {
            Log::error('キャンペーン画像設定エラー', [
                'message' => $e->getMessage(),
                'campaign_id' => $campaign->id,
                'media_id' => $validated['media_id'],
            ]);

            return back()->with('error', __('messages.set_failed', ['attribute' => '画像']));
        }
    }

    /**
     * サムネイル画像を削除
     */
    public function detachMedia(Campaign $campaign): RedirectResponse
    {
        try {
            $campaign->update(['media_id' => null]);

            return back()->with('success', __('messages.deleted', ['attribute' => 'サムネイル画像']));
        } catch (\Exception $e) {
            Log::error('キャンペーン画像削除エラー', [
                'message' => $e->getMessage(),
                'campaign_id' => $campaign->id,
            ]);

            return back()->with('error', __('messages.delete_failed', ['attribute' => '画像']));
        }
    }
}
