<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Website\PostRequest;
use App\Models\Media;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Admin;
use App\Services\MediaService;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private PostService $postService,
        private MediaService $mediaService
    ) {}

    /**
     * ブログ一覧
     */
    public function index(Request $request): Response
    {
        // フィルター
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'category_id' => $request->input('category_id'),
            'author_id' => $request->input('author_id'),
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];
        // ソート
        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];
        // ブログのページネーション取得
        $posts = $this->postService->getPaginated($filters, $sort, 15);
        // 統計情報の取得
        $stats = $this->postService->getStats();
        // フィルター用データ
        $categories = PostCategory::active()->ordered()->get(['id', 'name']);
        $authors = Admin::with('profile')
            ->get()
            ->map(fn (Admin $admin) => [
                'id' => $admin->id,
                'name' => $admin->profile?->full_name ?? $admin->email,
            ]);

        return Inertia::render('Admin/Website/Post/Index', [
            'posts' => $posts,
            'stats' => $stats,
            'categories' => $categories,
            'authors' => $authors,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        $categories = PostCategory::active()->ordered()->get(['id', 'name']);

        return Inertia::render('Admin/Website/Post/Create', [
            'categories' => $categories,
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * 保存
     */
    public function store(PostRequest $request): RedirectResponse
    {
        try {
            $post = $this->postService->createPost($request->validated());

            return redirect()->route('admin.website.post.show', $post)
                ->with('success', __('messages.created', ['attribute' => 'ブログ']));
        } catch (\Exception $e) {
            Log::error('Post store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'ブログ']));
        }
    }

    /**
     * 詳細表示
     */
    public function show(Post $post): Response
    {
        $post->load(['postCategory', 'createdBy', 'updatedBy']);

        return Inertia::render('Admin/Website/Post/Show', [
            'post' => $post,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Post $post): Response
    {
        $post->load(['postCategory', 'createdBy']);
        $categories = PostCategory::active()->ordered()->get(['id', 'name']);

        return Inertia::render('Admin/Website/Post/Edit', [
            'post' => $post,
            'categories' => $categories,
            'mediaList' => Media::query()->images()->latest()->limit(100)->get(),
        ]);
    }

    /**
     * 更新
     */
    public function update(PostRequest $request, Post $post): RedirectResponse
    {
        try {
            $this->postService->updatePost($post, $request->validated());

            return redirect()->route('admin.website.post.index')
                ->with('success', __('messages.updated', ['attribute' => 'ブログ']));
        } catch (\Exception $e) {
            Log::error('Post update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'ブログ']));
        }
    }

    /**
     * 削除
     */
    public function destroy(Post $post): RedirectResponse
    {
        try {
            $this->postService->deletePost($post);

            return redirect()->route('admin.website.post.index')
                ->with('success', __('messages.deleted', ['attribute' => 'ブログ']));
        } catch (\Exception $e) {
            Log::error('Post destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.delete_failed', ['attribute' => 'ブログ']));
        }
    }

    /**
     * 復元
     */
    public function restore(Post $post): RedirectResponse
    {
        try {
            $this->postService->restorePost($post);

            return redirect()->route('admin.website.post.index')
                ->with('success', __('messages.restored', ['attribute' => 'ブログ']));
        } catch (\Exception $e) {
            Log::error('Post restore error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.restore_failed', ['attribute' => 'ブログ']));
        }
    }

    /**
     * 公開ステータス変更
     */
    public function changeStatus(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'is_published' => ['required', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        try {
            $this->postService->changeStatus(
                $post,
                $validated['is_published'],
                $validated['published_at'] ?? null
            );

            return redirect()->back()->with('success', __('messages.status_changed'));
        } catch (\Exception $e) {
            Log::error('Post changeStatus error: ' . $e->getMessage());
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
            'ids.*' => ['string', 'exists:posts,id'],
            'action' => ['required', 'string', 'in:publish,unpublish,delete'],
        ]);

        try {
            $count = $this->postService->bulkAction($validated['ids'], $validated['action']);

            return redirect()->back()->with('success', "{$count}件のブログを更新しました。");
        } catch (\Exception $e) {
            Log::error('Post bulkAction error: ' . $e->getMessage());
            return redirect()->back()->with('error', __('messages.bulk_action_failed'));
        }
    }

    /**
     * ブロックエディタ用の画像アップロード
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
