<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\VoiceRequest;
use App\Models\Media;
use App\Models\Service;
use App\Models\User;
use App\Models\Voice;
use App\Services\VoiceService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class VoiceController extends Controller
{
    public function __construct(
        private VoiceService $voiceService
    ) {}

    /**
     * お客様の声一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'service_id' => $request->input('service_id'),
            'is_published' => $request->input('is_published'),
            'is_featured' => $request->input('is_featured'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $voices = $this->voiceService->getPaginated($filters, $sort, 15);
        $stats = $this->voiceService->getStats();
        $services = Service::query()->orderBy('sort_order')->get(['id', 'name']);

        return Inertia::render('Admin/Website/Voice/Index', [
            'voices' => $voices,
            'stats' => $stats,
            'services' => $services,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Website/Voice/Create', [
            'services' => Service::query()->orderBy('sort_order')->get(['id', 'name']),
            'users' => User::query()->with('profile')->latest()->limit(100)->get(['id', 'email']),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * 保存
     */
    public function store(VoiceRequest $request): RedirectResponse
    {
        try {
            $this->voiceService->create($request->validated());

            return redirect()->route('admin.website.voice.index')
                ->with('success', 'お客様の声を作成しました。');
        } catch (\Exception $e) {
            Log::error('Voice store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'お客様の声の作成に失敗しました。');
        }
    }

    /**
     * 詳細表示
     */
    public function show(Voice $voice): Response
    {
        $voice->load(['service', 'user.profile', 'avatar']);

        return Inertia::render('Admin/Website/Voice/Show', [
            'voice' => $voice,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Voice $voice): Response
    {
        $voice->load(['service', 'user.profile', 'avatar']);

        return Inertia::render('Admin/Website/Voice/Edit', [
            'voice' => $voice,
            'services' => Service::query()->orderBy('sort_order')->get(['id', 'name']),
            'users' => User::query()->with('profile')->latest()->limit(100)->get(['id', 'email']),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * 更新
     */
    public function update(VoiceRequest $request, Voice $voice): RedirectResponse
    {
        try {
            $this->voiceService->update($voice, $request->validated());

            return redirect()->route('admin.website.voice.index')
                ->with('success', 'お客様の声を更新しました。');
        } catch (\Exception $e) {
            Log::error('Voice update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'お客様の声の更新に失敗しました。');
        }
    }

    /**
     * 削除
     */
    public function destroy(Voice $voice): RedirectResponse
    {
        try {
            $this->voiceService->deleteVoice($voice);

            return redirect()->route('admin.website.voice.index')
                ->with('success', 'お客様の声を削除しました。');
        } catch (\Exception $e) {
            Log::error('Voice destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'お客様の声の削除に失敗しました。');
        }
    }

    /**
     * 公開ステータス変更
     */
    public function changeStatus(Request $request, Voice $voice): RedirectResponse
    {
        $validated = $request->validate([
            'is_published' => ['required', 'boolean'],
        ]);

        try {
            $this->voiceService->changeStatus($voice, $validated['is_published']);

            return redirect()->back()->with('success', 'ステータスを変更しました。');
        } catch (\Exception $e) {
            Log::error('Voice changeStatus error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'ステータスの変更に失敗しました。');
        }
    }

    /**
     * 一括操作
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['string', 'exists:voices,id'],
            'action' => ['required', 'string', 'in:publish,unpublish,delete'],
        ]);

        try {
            $count = $this->voiceService->bulkAction($validated['ids'], $validated['action']);

            return redirect()->back()->with('success', "{$count}件のお客様の声を更新しました。");
        } catch (\Exception $e) {
            Log::error('Voice bulkAction error: ' . $e->getMessage());
            return redirect()->back()->with('error', '一括操作に失敗しました。');
        }
    }
}
