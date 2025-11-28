<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\PageService;
use App\Http\Requests\Admin\Homepage\PageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(
        private PageService $pageService
    ) {
        // 必要に応じて個別の権限制御を追加
        // $this->middleware('can:manage,Page');
    }
    /**
     * ページ一覧
     * 
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        try {
            $pages = Page::orderBy('sort_order')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($page) {
                    return [
                        'id' => $page->id,
                        'title' => $page->title,
                        'slug' => $page->slug,
                        'template' => $page->template,
                        'is_published' => $page->is_published,
                        'sort_order' => $page->sort_order,
                        'updated_at' => $page->updated_at->format('Y/m/d H:i'),
                    ];
                });
    
            return Inertia::render('Admin/Homepage/Pages/Index', [
                'pages' => $pages,
            ]);
        } catch (\Exception $e) {
            Log::error('Page index error: ' . $e->getMessage());
            return Inertia::render('Admin/Homepage/Pages/Index', [
                'pages' => [],
                'error' => __('messages.page.index_failed'),
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        try {
            return Inertia::render('Admin/Homepage/Pages/Create', [
                'templates' => $this->getAvailableTemplates(),
            ]);
        } catch (\Exception $e) {
            Log::error('Page create error: ' . $e->getMessage());
            return Inertia::render('Admin/Homepage/Pages/Create', [
                'templates' => [],
                'error' => __('messages.page.create_failed'),
            ]);
        }
    }

    /**
     * ページ保存
     * 
     * @return RedirectResponse
     */
    public function store(PageRequest $request): RedirectResponse
    {
        try {
            $this->pageService->createPage($request->validated());
            return redirect()
                ->route('admin.homepage.pages.index')
                ->with('success', __('messages.page.created'));
        } catch (\Exception $e) {
            Log::error('Page store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.page.create_failed'));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page): Response
    {
        return Inertia::render('Admin/Homepage/Pages/Show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'template' => $page->template,
                'content' => $page->content,
                'meta' => $page->meta,
                'settings' => $page->settings,
                'is_published' => $page->is_published,
                'sort_order' => $page->sort_order,
                'created_at' => $page->created_at->format('Y/m/d H:i'),
                'updated_at' => $page->updated_at->format('Y/m/d H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Homepage/Pages/Edit', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'template' => $page->template,
                'content' => $page->content,
                'meta' => $page->meta,
                'settings' => $page->settings,
                'is_published' => $page->is_published,
                'sort_order' => $page->sort_order,
            ],
            'templates' => $this->getAvailableTemplates(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $page->update($request->validated());

        return redirect()
            ->route('admin.homepage.pages.index')
            ->with('message', 'ページが正常に更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return redirect()
            ->route('admin.homepage.pages.index')
            ->with('message', 'ページが正常に削除されました。');
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
            'page' => '標準ページ',
        ];
    }
}
