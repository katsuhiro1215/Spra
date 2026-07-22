<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Website\FaqRequest;
use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\Service;
use App\Services\FaqService;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function __construct(
        private FaqService $faqService,
        private MediaService $mediaService
    ) {}

    /**
     * FAQ一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'faq_category_id' => $request->input('faq_category_id'),
            'is_published' => $request->input('is_published'),
            'is_featured' => $request->input('is_featured'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $faqs = $this->faqService->getPaginated($filters, $sort, 15);
        $stats = $this->faqService->getStats();
        $categories = FaqCategory::active()->ordered()->get(['id', 'name']);

        return Inertia::render('Admin/Website/Faq/Index', [
            'faqs' => $faqs,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Website/Faq/Create', [
            'categories' => FaqCategory::active()->ordered()->get(['id', 'name']),
            'services' => Service::query()->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    /**
     * 保存
     */
    public function store(FaqRequest $request): RedirectResponse
    {
        try {
            $this->faqService->createFaq($request->validated());

            return redirect()->route('admin.website.faq.index')
                ->with('success', __('messages.created', ['attribute' => 'FAQ']));
        } catch (\Exception $e) {
            Log::error('Faq store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'FAQ']));
        }
    }

    /**
     * 詳細表示
     */
    public function show(Faq $faq): Response
    {
        $faq->load(['faqCategory', 'services']);

        return Inertia::render('Admin/Website/Faq/Show', [
            'faq' => $faq,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Faq $faq): Response
    {
        $faq->load(['faqCategory', 'services']);

        return Inertia::render('Admin/Website/Faq/Edit', [
            'faq' => $faq,
            'categories' => FaqCategory::active()->ordered()->get(['id', 'name']),
            'services' => Service::query()->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    /**
     * 更新
     */
    public function update(FaqRequest $request, Faq $faq): RedirectResponse
    {
        try {
            $this->faqService->updateFaq($faq, $request->validated());

            return redirect()->route('admin.website.faq.index')
                ->with('success', __('messages.updated', ['attribute' => 'FAQ']));
        } catch (\Exception $e) {
            Log::error('Faq update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'FAQ']));
        }
    }

    /**
     * 削除
     */
    public function destroy(Faq $faq): RedirectResponse
    {
        try {
            $this->faqService->deleteFaq($faq);

            return redirect()->route('admin.website.faq.index')
                ->with('success', __('messages.deleted', ['attribute' => 'FAQ']));
        } catch (\Exception $e) {
            Log::error('Faq destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.delete_failed', ['attribute' => 'FAQ']));
        }
    }

    /**
     * 公開ステータス変更
     */
    public function changeStatus(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'is_published' => ['required', 'boolean'],
        ]);

        try {
            $this->faqService->changeStatus($faq, $validated['is_published']);

            return redirect()->back()->with('success', __('messages.status_changed'));
        } catch (\Exception $e) {
            Log::error('Faq changeStatus error: ' . $e->getMessage());
            return redirect()->back()->with('error', __('messages.status_change_failed'));
        }
    }

    /**
     * 一括操作
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['string', 'exists:faqs,id'],
            'action' => ['required', 'string', 'in:publish,unpublish,delete'],
        ]);

        try {
            $count = $this->faqService->bulkAction($validated['ids'], $validated['action']);

            return redirect()->back()->with('success', "{$count}件のFAQを更新しました。");
        } catch (\Exception $e) {
            Log::error('Faq bulkAction error: ' . $e->getMessage());
            return redirect()->back()->with('error', __('messages.bulk_action_failed'));
        }
    }

    /**
     * 回答エディタ用の画像アップロード
     */
    public function uploadEditorImage(StoreMediaRequest $request)
    {
        try {
            $media = $this->mediaService->uploadImage(
                $request->file('image'),
                $request->validated(),
                Auth::guard('admins')->id()
            );

            return response()->json([
                'success' => true,
                'media' => $media,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('messages.action_failed_detail', ['attribute' => '画像のアップロード', 'message' => $e->getMessage()]),
            ], 422);
        }
    }
}
