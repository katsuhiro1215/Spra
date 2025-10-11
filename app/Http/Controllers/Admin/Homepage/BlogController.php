<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Blog::with(['admin', 'categories', 'featuredMedia'])
            ->withCount('media');

        // 検索機能
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%')
                    ->orWhere('excerpt', 'like', '%' . $request->search . '%');
            });
        }

        // ステータスフィルター
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // カテゴリフィルター
        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('blog_categories.id', $request->category_id);
            });
        }

        // 作成者フィルター
        if ($request->filled('author_id')) {
            $query->where('admin_id', $request->author_id);
        }

        // ソート
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        if ($sortField === 'categories') {
            $query->leftJoin('blog_blog_category', 'blogs.id', '=', 'blog_blog_category.blog_id')
                ->leftJoin('blog_categories', 'blog_blog_category.blog_category_id', '=', 'blog_categories.id')
                ->select('blogs.*')
                ->orderBy('blog_categories.name', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $blogs = $query->paginate(15)->withQueryString();

        // フィルター用データ
        $categories = BlogCategory::active()->ordered()->get(['id', 'name', 'color']);
        $authors = \App\Models\Admin::select('id', 'name')->get();

        return Inertia::render('Admin/Homepage/Blogs/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'authors' => $authors,
            'filters' => $request->only(['search', 'status', 'category_id', 'author_id', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = BlogCategory::active()->ordered()->get(['id', 'name', 'color']);
        $media = Media::where('type', 'image')->latest()->limit(50)->get();

        return Inertia::render('Admin/Homepage/Blogs/Create', [
            'categories' => $categories,
            'media' => $media,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'featured_media_id' => 'nullable|exists:media,id',
            'categories' => 'array',
            'categories.*' => 'exists:blog_categories,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:300',
            'gallery_media_ids' => 'array',
            'gallery_media_ids.*' => 'exists:media,id',
        ], [
            'title.required' => 'タイトルは必須です。',
            'content.required' => 'コンテンツは必須です。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'status.required' => 'ステータスを選択してください。',
            'status.in' => '無効なステータスです。',
        ]);

        DB::transaction(function () use ($validated) {
            $blog = Blog::create([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'excerpt' => $validated['excerpt'],
                'content' => $validated['content'],
                'status' => $validated['status'],
                'published_at' => $validated['published_at'],
                'featured_media_id' => $validated['featured_media_id'],
                'meta_title' => $validated['meta_title'],
                'meta_description' => $validated['meta_description'],
                'admin_id' => Auth::guard('admins')->id(),
            ]);

            // カテゴリを関連付け
            if (!empty($validated['categories'])) {
                $blog->categories()->sync($validated['categories']);
            }

            // ギャラリーメディアを関連付け
            if (!empty($validated['gallery_media_ids'])) {
                $blog->media()->sync($validated['gallery_media_ids']);
            }
        });

        return redirect()->route('admin.homepage.blogs.index')
            ->with('success', 'ブログを作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog): Response
    {
        $blog->load(['admin', 'categories', 'featuredMedia', 'media']);

        return Inertia::render('Admin/Homepage/Blogs/Show', [
            'blog' => $blog,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog): Response
    {
        $blog->load(['categories', 'featuredMedia', 'media']);
        $categories = BlogCategory::active()->ordered()->get(['id', 'name', 'color']);
        $media = Media::where('type', 'image')->latest()->limit(50)->get();

        return Inertia::render('Admin/Homepage/Blogs/Edit', [
            'blog' => $blog,
            'categories' => $categories,
            'media' => $media,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blogs')->ignore($blog)],
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'featured_media_id' => 'nullable|exists:media,id',
            'categories' => 'array',
            'categories.*' => 'exists:blog_categories,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:300',
            'gallery_media_ids' => 'array',
            'gallery_media_ids.*' => 'exists:media,id',
        ], [
            'title.required' => 'タイトルは必須です。',
            'content.required' => 'コンテンツは必須です。',
            'slug.unique' => 'このスラッグは既に使用されています。',
            'status.required' => 'ステータスを選択してください。',
            'status.in' => '無効なステータスです。',
        ]);

        DB::transaction(function () use ($validated, $blog) {
            $blog->update([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'excerpt' => $validated['excerpt'],
                'content' => $validated['content'],
                'status' => $validated['status'],
                'published_at' => $validated['published_at'],
                'featured_media_id' => $validated['featured_media_id'],
                'meta_title' => $validated['meta_title'],
                'meta_description' => $validated['meta_description'],
            ]);

            // カテゴリを更新
            if (isset($validated['categories'])) {
                $blog->categories()->sync($validated['categories']);
            }

            // ギャラリーメディアを更新
            if (isset($validated['gallery_media_ids'])) {
                $blog->media()->sync($validated['gallery_media_ids']);
            }
        });

        return redirect()->route('admin.homepage.blogs.index')
            ->with('success', 'ブログを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog): RedirectResponse
    {
        DB::transaction(function () use ($blog) {
            // 関連データを削除
            $blog->categories()->detach();
            $blog->media()->detach();
            $blog->delete();
        });

        return redirect()->route('admin.homepage.blogs.index')
            ->with('success', 'ブログを削除しました。');
    }

    /**
     * 一括操作
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:publish,draft,delete',
            'ids' => 'required|array',
            'ids.*' => 'exists:blogs,id',
        ]);

        $blogs = Blog::whereIn('id', $validated['ids']);

        switch ($validated['action']) {
            case 'publish':
                $blogs->update([
                    'status' => 'published',
                    'published_at' => now()
                ]);
                $message = '選択したブログを公開しました。';
                break;
            case 'draft':
                $blogs->update([
                    'status' => 'draft',
                    'published_at' => null
                ]);
                $message = '選択したブログを下書きに変更しました。';
                break;
            case 'delete':
                DB::transaction(function () use ($blogs) {
                    foreach ($blogs->get() as $blog) {
                        $blog->categories()->detach();
                        $blog->media()->detach();
                        $blog->delete();
                    }
                });
                $message = '選択したブログを削除しました。';
                break;
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * ステータス変更
     */
    public function changeStatus(Request $request, Blog $blog): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
        ]);

        $blog->update([
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published'
                ? ($validated['published_at'] ?? now())
                : $validated['published_at']
        ]);

        $statusLabel = match ($validated['status']) {
            'published' => '公開',
            'draft' => '下書き',
            'scheduled' => '予約投稿',
        };

        return redirect()->back()
            ->with('success', "ブログのステータスを「{$statusLabel}」に変更しました。");
    }

    /**
     * エディタ用の画像アップロード
     */
    public function uploadEditorImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:10240', // 10MB
        ]);

        try {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('editor-images', $filename, 'public');

            $media = Media::create([
                'filename' => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'file_path' => $path,
                'url' => asset('storage/' . $path),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'alt_text' => '',
                'admin_id' => Auth::id(),
            ]);

            return response()->json([
                'location' => $media->url
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'ファイルのアップロードに失敗しました。'
            ], 500);
        }
    }
}
