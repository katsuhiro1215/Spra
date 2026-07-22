<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageTypeRequest;
use App\Models\PageType;
use App\Services\PageTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PageTypeController extends Controller
{
    public function __construct(
        private PageTypeService $pageTypeService
    ) {}

    /**
     * ページタイプ一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'is_system' => $request->input('is_system'),
            'is_dynamic' => $request->input('is_dynamic'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $pageTypes = $this->pageTypeService->getPaginated($filters, $sort, 20);
        $stats = $this->pageTypeService->getStats();

        return Inertia::render('Admin/Website/PageType/Index', [
            'pageTypes' => $pageTypes,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Website/PageType/Create');
    }

    /**
     * 保存
     */
    public function store(PageTypeRequest $request): RedirectResponse
    {
        try {
            $this->pageTypeService->createPageType($request->validated());

            return redirect()->route('admin.website.page.type.index')
                ->with('success', __('messages.created', ['attribute' => 'ページタイプ']));
        } catch (\Exception $e) {
            Log::error('PageType store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'ページタイプ']));
        }
    }

    /**
     * 詳細表示
     */
    public function show(PageType $pageType): Response
    {
        return Inertia::render('Admin/Website/PageType/Show', [
            'pageType' => $pageType,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(PageType $pageType): Response
    {
        return Inertia::render('Admin/Website/PageType/Edit', [
            'pageType' => $pageType,
        ]);
    }

    /**
     * 更新
     */
    public function update(PageTypeRequest $request, PageType $pageType): RedirectResponse
    {
        try {
            $this->pageTypeService->updatePageType($pageType, $request->validated());

            return redirect()->route('admin.website.page.type.index')
                ->with('success', __('messages.updated', ['attribute' => 'ページタイプ']));
        } catch (\Exception $e) {
            Log::error('PageType update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'ページタイプ']));
        }
    }

    /**
     * 削除
     */
    public function destroy(PageType $pageType): RedirectResponse
    {
        try {
            $this->pageTypeService->deletePageType($pageType);

            return redirect()->route('admin.website.page.type.index')
                ->with('success', __('messages.deleted', ['attribute' => 'ページタイプ']));
        } catch (\Exception $e) {
            Log::error('PageType destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
