<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageType;
use App\Services\PageService;
use App\Http\Requests\Website\PageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(
        private PageService $pageService
    ) {}

    /**
     * ページ一覧
     */
    public function index(Request $request): Response
    {
        // フィルター
        $filters = [
            'search' => $request->input('search'),
            'is_published' => $request->input('is_published'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];
        // ソート
        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];
        // ページのページネーション取得
        $pages = $this->pageService->getPaginated($filters, $sort, 15);
        // 統計情報の取得
        $stats = $this->pageService->getStats();

        return Inertia::render('Admin/Website/Page/Index', [
            'pages' => $pages,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        $pageTypes = PageType::query()
            ->orderBy('name')
            ->get(['id', 'name', 'key', 'description']);

        return Inertia::render('Admin/Website/Page/Create', [
            'pageTypes' => $pageTypes,
            'templates' => $this->getAvailableTemplates(),
        ]);
    }

    /**
     * 保存
     */
    public function store(PageRequest $request): RedirectResponse
    {
        try {
            $page = $this->pageService->createPage($request->validated());

            return redirect()->route('admin.website.page.edit', $page)
                ->with('success', __('messages.website_page.created_continue_edit_sections'));
        } catch (\Exception $e) {
            Log::error('Page store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'ページ']));
        }
    }

    /**
     * 詳細表示
     */
    public function show(Page $page): Response
    {
        $page->load([
            'sections' => fn ($query) => $query->orderBy('sort_order'),
            'pageType',
        ]);

        return Inertia::render('Admin/Website/Page/Show', [
            'page' => $page,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Page $page): Response
    {
        $page->load([
            'sections' => fn ($query) => $query->orderBy('sort_order'),
            'pageType',
        ]);

        $pageTypes = PageType::query()
            ->orderBy('name')
            ->get(['id', 'name', 'key', 'description']);

        return Inertia::render('Admin/Website/Page/Edit', [
            'page' => $page,
            'pageTypes' => $pageTypes,
            'templates' => $this->getAvailableTemplates(),
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * 更新
     */
    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        try {
            $this->pageService->updatePage($page, $request->validated());

            return redirect()->route('admin.website.page.index')
                ->with('success', __('messages.updated', ['attribute' => 'ページ']));
        } catch (\Exception $e) {
            Log::error('Page update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'ページ']));
        }
    }

    /**
     * 削除
     */
    public function destroy(Page $page): RedirectResponse
    {
        try {
            $this->pageService->deletePage($page);

            return redirect()->route('admin.website.page.index')
                ->with('success', __('messages.deleted', ['attribute' => 'ページ']));
        } catch (\Exception $e) {
            Log::error('Page destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.delete_failed', ['attribute' => 'ページ']));
        }
    }

    /**
     * 復元
     */
    public function restore(Page $page): RedirectResponse
    {
        try {
            $this->pageService->restorePage($page);

            return redirect()->route('admin.website.page.index')
                ->with('success', __('messages.restored', ['attribute' => 'ページ']));
        } catch (\Exception $e) {
            Log::error('Page restore error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.restore_failed', ['attribute' => 'ページ']));
        }
    }

    /**
     * 利用可能なテンプレート一覧を取得
     */
    private function getAvailableTemplates(): array
    {
        return [
            'home' => 'ホームページ',
            'about' => '会社概要',
            'contact' => 'お問い合わせ',
            'service' => 'サービス',
            'blog' => 'ブログ',
            'faq' => 'FAQ',
            'page' => '標準ページ',
        ];
    }
}
