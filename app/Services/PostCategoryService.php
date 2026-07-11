<?php

namespace App\Services;

use App\Models\PostCategory;
use App\Repositories\PostCategoryRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostCategoryService extends BaseService
{
    public function __construct(PostCategoryRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'PostCategory';
    }

    public function createPostCategory(array $data): PostCategory
    {
        return DB::transaction(function () use ($data) {
            $data['created_by'] = Auth::guard('admins')->id();
            return $this->repository->create($data);
        });
    }

    public function updatePostCategory(PostCategory $postCategory, array $data): PostCategory
    {
        return DB::transaction(function () use ($postCategory, $data) {
            $data['updated_by'] = Auth::guard('admins')->id();
            return $this->repository->update($postCategory, $data);
        });
    }

    public function deletePostCategory(PostCategory $postCategory): bool
    {
        return DB::transaction(function () use ($postCategory) {
            // 子カテゴリがある場合は削除不可
            if ($postCategory->children()->count() > 0) {
                throw new \Exception('子カテゴリが存在するため削除できません。');
            }
            return $this->repository->delete($postCategory);
        });
    }

    public function restorePostCategory(PostCategory $postCategory): bool
    {
        return $this->repository->restore($postCategory);
    }

    public function getHierarchicalCategories()
    {
        return $this->repository->getAllHierarchical();
    }
}
