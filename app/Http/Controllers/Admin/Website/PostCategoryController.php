<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\PostCategoryRequest;
use App\Models\PostCategory;
use App\Services\PostCategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostCategoryController extends Controller
{
    public function __construct(private PostCategoryService $postCategoryService)
    {
    }

    /**
     * ブログカテゴリ一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'parent_id' => $request->input('parent_id'),
            'is_active' => $request->input('is_active'),
            'trashed' => $request->input('trashed', 'without'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $categories = $this->postCategoryService->getPaginated($filters, $sort, 20);
        $stats = $this->postCategoryService->getStats();
        $allCategories = PostCategory::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Website/PostCategory/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'allCategories' => $allCategories,
            'filters' => $filters,
        ]);
    }

    /**
     * ブログカテゴリ作成画面
     */
    public function create(): Response
    {
        $categories = PostCategory::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Website/PostCategory/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * ブログカテゴリ作成処理
     */
    public function store(PostCategoryRequest $request): RedirectResponse
    {
        try {
            $this->postCategoryService->createPostCategory($request->validated());

            return redirect()
                ->route('admin.website.post.category.index')
                ->with('success', 'カテゴリを作成しました。');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'カテゴリの作成に失敗しました。']);
        }
    }

    /**
     * ブログカテゴリ詳細
     */
    public function show(PostCategory $postCategory): Response
    {
        $postCategory->load(['parent', 'children', 'posts', 'createdBy', 'updatedBy']);

        return Inertia::render('Admin/Website/PostCategory/Show', [
            'category' => $postCategory,
        ]);
    }

    /**
     * ブログカテゴリ編集画面
     */
    public function edit(PostCategory $postCategory): Response
    {
        $postCategory->load('parent');
        $categories = PostCategory::where('id', '!=', $postCategory->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Website/PostCategory/Edit', [
            'category' => $postCategory,
            'categories' => $categories,
        ]);
    }

    /**
     * ブログカテゴリ更新処理
     */
    public function update(PostCategoryRequest $request, PostCategory $postCategory): RedirectResponse
    {
        try {
            $this->postCategoryService->updatePostCategory($postCategory, $request->validated());

            return redirect()
                ->route('admin.website.post.category.index')
                ->with('success', 'カテゴリを更新しました。');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'カテゴリの更新に失敗しました。']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostCategory $postCategory): RedirectResponse
    {
        try {
            $this->postCategoryService->deletePostCategory($postCategory);

            return redirect()
                ->route('admin.website.post.category.index')
                ->with('success', 'カテゴリを削除しました。');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
