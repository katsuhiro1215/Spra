<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\FaqCategoryRequest;
use App\Models\FaqCategory;
use App\Services\FaqCategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class FaqCategoryController extends Controller
{
    public function __construct(private FaqCategoryService $faqCategoryService)
    {
    }

    /**
     * FAQカテゴリ一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'is_active' => $request->input('is_active'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $categories = $this->faqCategoryService->getPaginated($filters, $sort, 20);
        $stats = $this->faqCategoryService->getStats();

        return Inertia::render('Admin/Website/FaqCategory/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * FAQカテゴリ作成画面
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Website/FaqCategory/Create');
    }

    /**
     * FAQカテゴリ作成処理
     */
    public function store(FaqCategoryRequest $request): RedirectResponse
    {
        try {
            $this->faqCategoryService->createFaqCategory($request->validated());

            return redirect()
                ->route('admin.website.faq.category.index')
                ->with('success', 'FAQカテゴリを作成しました。');
        } catch (\Exception $e) {
            Log::error('FaqCategory store error: ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'FAQカテゴリの作成に失敗しました。');
        }
    }

    /**
     * FAQカテゴリ詳細
     */
    public function show(FaqCategory $faqCategory): Response
    {
        $faqCategory->load(['faqs', 'createdBy', 'updatedBy']);

        return Inertia::render('Admin/Website/FaqCategory/Show', [
            'category' => $faqCategory,
        ]);
    }

    /**
     * FAQカテゴリ編集画面
     */
    public function edit(FaqCategory $faqCategory): Response
    {
        return Inertia::render('Admin/Website/FaqCategory/Edit', [
            'category' => $faqCategory,
        ]);
    }

    /**
     * FAQカテゴリ更新処理
     */
    public function update(FaqCategoryRequest $request, FaqCategory $faqCategory): RedirectResponse
    {
        try {
            $this->faqCategoryService->updateFaqCategory($faqCategory, $request->validated());

            return redirect()
                ->route('admin.website.faq.category.index')
                ->with('success', 'FAQカテゴリを更新しました。');
        } catch (\Exception $e) {
            Log::error('FaqCategory update error: ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'FAQカテゴリの更新に失敗しました。');
        }
    }

    /**
     * FAQカテゴリ削除
     */
    public function destroy(FaqCategory $faqCategory): RedirectResponse
    {
        try {
            $this->faqCategoryService->deleteFaqCategory($faqCategory);

            return redirect()
                ->route('admin.website.faq.category.index')
                ->with('success', 'FAQカテゴリを削除しました。');
        } catch (\Exception $e) {
            Log::error('FaqCategory destroy error: ' . $e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'FAQカテゴリの削除に失敗しました。');
        }
    }

    /**
     * 一括操作
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['string', 'exists:faq_categories,id'],
            'action' => ['required', 'string', 'in:activate,deactivate,delete'],
        ]);

        try {
            $count = $this->faqCategoryService->bulkAction($validated['ids'], $validated['action']);

            return redirect()->back()->with('success', "{$count}件のFAQカテゴリを更新しました。");
        } catch (\Exception $e) {
            Log::error('FaqCategory bulkAction error: ' . $e->getMessage());
            return redirect()->back()->with('error', '一括操作に失敗しました。');
        }
    }

    /**
     * 表示順の一括更新
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'orders' => ['required', 'array'],
            'orders.*.id' => ['required', 'string', 'exists:faq_categories,id'],
            'orders.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        try {
            $this->faqCategoryService->updateOrder($validated['orders']);

            return redirect()->back()->with('success', '表示順を更新しました。');
        } catch (\Exception $e) {
            Log::error('FaqCategory updateOrder error: ' . $e->getMessage());
            return redirect()->back()->with('error', '表示順の更新に失敗しました。');
        }
    }
}
