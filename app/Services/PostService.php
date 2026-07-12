<?php

namespace App\Services;

use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(PostRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'Post';
    }

    /**
     * ブログを作成
     *
     * @param array $data
     * @return Post
     */
    public function createPost(array $data): Post
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();

            $post = $this->repository->create($data);

            return $post->fresh(['postCategory', 'createdBy']);
        });
    }

    /**
     * ブログを更新
     *
     * @param Post $post
     * @param array $data
     * @return Post
     */
    public function updatePost(Post $post, array $data): Post
    {
        return DB::transaction(function () use ($post, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();

            $post = $this->repository->update($post, $data);

            return $post->fresh(['postCategory', 'createdBy']);
        });
    }

    /**
     * ブログを削除
     */
    public function deletePost(Post $post): bool
    {
        return DB::transaction(function () use ($post) {
            return $this->repository->delete($post);
        });
    }

    /**
     * ブログを復元
     */
    public function restorePost(Post $post): bool
    {
        return $this->repository->restore($post);
    }

    /**
     * 公開ステータスを変更
     */
    public function changeStatus(Post $post, bool $isPublished, ?string $publishedAt = null): Post
    {
        return DB::transaction(function () use ($post, $isPublished, $publishedAt) {
            $data = [
                'is_published' => $isPublished,
                'updated_by' => Auth::guard('admins')->id(),
            ];

            if ($isPublished) {
                $data['published_at'] = $publishedAt ?? $post->published_at ?? now();
            }

            return $this->repository->update($post, $data);
        });
    }

    /**
     * 一括操作（公開・非公開・削除）
     */
    public function bulkAction(array $ids, string $action): int
    {
        return DB::transaction(function () use ($ids, $action) {
            $query = Post::whereIn('id', $ids);

            return match ($action) {
                'publish' => $query->update([
                    'is_published' => true,
                    'published_at' => now(),
                    'updated_by' => Auth::guard('admins')->id(),
                ]),
                'unpublish' => $query->update([
                    'is_published' => false,
                    'updated_by' => Auth::guard('admins')->id(),
                ]),
                'delete' => $query->get()->reduce(function (int $count, Post $post) {
                    return $count + ($this->repository->delete($post) ? 1 : 0);
                }, 0),
                default => 0,
            };
        });
    }
}
