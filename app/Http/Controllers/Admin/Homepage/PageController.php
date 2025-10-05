<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
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
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Homepage/Pages/Create', [
            'templates' => $this->getAvailableTemplates(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'template' => 'required|string|max:50',
            'content' => 'nullable|array',
            'meta' => 'nullable|array',
            'settings' => 'nullable|array',
            'is_published' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        Page::create($validated);

        return redirect()
            ->route('admin.homepage.pages.index')
            ->with('message', 'ページが正常に作成されました。');
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
    public function update(Request $request, Page $page): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pages', 'slug')->ignore($page->id),
            ],
            'template' => 'required|string|max:50',
            'content' => 'nullable|array',
            'meta' => 'nullable|array',
            'settings' => 'nullable|array',
            'is_published' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $page->update($validated);

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
