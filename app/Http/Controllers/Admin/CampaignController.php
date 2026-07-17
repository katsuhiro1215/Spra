<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampaignRequest;
use App\Models\Campaign;
use App\Models\Media;
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
        $campaign->load('media');

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

            return back()->with('success', 'サムネイル画像を設定しました。');
        } catch (\Exception $e) {
            Log::error('キャンペーン画像設定エラー', [
                'message' => $e->getMessage(),
                'campaign_id' => $campaign->id,
                'media_id' => $validated['media_id'],
            ]);

            return back()->with('error', '画像の設定に失敗しました。');
        }
    }

    /**
     * サムネイル画像を削除
     */
    public function detachMedia(Campaign $campaign): RedirectResponse
    {
        try {
            $campaign->update(['media_id' => null]);

            return back()->with('success', 'サムネイル画像を削除しました。');
        } catch (\Exception $e) {
            Log::error('キャンペーン画像削除エラー', [
                'message' => $e->getMessage(),
                'campaign_id' => $campaign->id,
            ]);

            return back()->with('error', '画像の削除に失敗しました。');
        }
    }
}
