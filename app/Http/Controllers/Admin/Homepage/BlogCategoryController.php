<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Homepage\BlogCategoryRequest;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    /**
     * ブログカテゴリ一覧
     */
    public function index(Request $request): Response
    {
        $query = BlogCategory::with(['blogs' => function ($query) {
            $query->select('id', 'title', 'status');
        }]);

        // 検索機能
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // ステータスフィルター
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // ソート
        $sortField = $request->get('sort', 'sort_order');
        $sortDirection = $request->get('direction', 'asc');

        if ($sortField === 'posts_count') {
            $query->withCount('blogs')->orderBy('blogs_count', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $categories = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Homepage/Blogs/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * ブログカテゴリ作成画面
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Homepage/Blogs/Categories/Create');
    }

    /**
     * ブログカテゴリ作成処理
     */
    public function store(BlogCategoryRequest $request): RedirectResponse
    {
        try {
            BlogCategory::create($request->validated());
            
            return redirect()->route('admin.homepage.blogCategories.index')
            ->with('success', __('messages.blog_category.created'));
        } catch (\Exception $e) {
            // その他のエラー
            Log::error('BlogCategory store error: ' . $e->getMessage());

            return back()->withInput()
                ->with('error', __('messages.blog_category.created_failed'));
        }
    }

    /**
     * ブログカテゴリ詳細
     */
    public function show(BlogCategory $blogCategory): Response
    {
        $blogCategory->load(['blogs' => function ($query) {
            $query->with('admin')->latest();
        }]);

        return Inertia::render('Admin/Homepage/Blogs/Categories/Show', [
            'category' => $blogCategory,
        ]);
    }

    /**
     * ブログカテゴリ編集画面
     */
    public function edit(BlogCategory $blogCategory): Response
    {
        return Inertia::render('Admin/Homepage/Blogs/Categories/Edit', [
            'category' => $blogCategory,
        ]);
    }

    /**
     * ブログカテゴリ更新処理
     */
    public function update(BlogCategoryRequest $request, BlogCategory $blogCategory): RedirectResponse
    {
        // 更新処理
        try {
            $blogCategory->update($request->validated());
    
            return redirect()->route('admin.homepage.blogCategories.index')
                ->with('success', __('messages.blog_category.updated'));
        } catch (\Exception $e) {
            // その他のエラー
            Log::error('BlogCategory update error: ' . $e->getMessage());

            return back()->withInput()
                ->with('error', __('messages.blog_category.update_failed'));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogCategory $blogCategory): RedirectResponse
    {
        // ブログが関連付けられている場合は削除を防ぐ
        if ($blogCategory->blogs()->count() > 0) {
            return redirect()->back()
                ->with('error', 'このカテゴリには関連するブログが存在するため削除できません。');
        }

        $blogCategory->delete();

        return redirect()->route('admin.homepage.blogCategories.index')
            ->with('success', 'ブログカテゴリを削除しました。');
    }

    /**
     * 一括操作
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'exists:blog_categories,id',
        ]);

        $categories = BlogCategory::whereIn('id', $validated['ids']);

        switch ($validated['action']) {
            case 'activate':
                $categories->update(['is_active' => true]);
                $message = '選択したカテゴリを有効化しました。';
                break;
            case 'deactivate':
                $categories->update(['is_active' => false]);
                $message = '選択したカテゴリを無効化しました。';
                break;
            case 'delete':
                // 関連ブログがあるカテゴリは削除しない
                $categoriesWithBlogs = $categories->whereHas('blogs')->count();
                if ($categoriesWithBlogs > 0) {
                    return redirect()->back()
                        ->with('error', '関連するブログが存在するカテゴリがあるため削除できませんでした。');
                }
                $categories->delete();
                $message = '選択したカテゴリを削除しました。';
                break;
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * ソート順更新
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:blog_categories,id',
            'categories.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['categories'] as $categoryData) {
            BlogCategory::where('id', $categoryData['id'])
                ->update(['sort_order' => $categoryData['sort_order']]);
        }

        return redirect()->back()->with('success', 'ソート順を更新しました。');
    }
}
