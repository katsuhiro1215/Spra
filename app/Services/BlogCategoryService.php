<?php

namespace App\Services;

use App\Models\BlogCategory;
use App\Repositories\BloCategoryRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class BlogCategoryService
{
    /**
     * ページネーション付きでブログカテゴリを取得
     */
    public function getPaginatedBlogCategories(array $filters, array $sort, int $perPage = 20): LengthAwarePaginator
    {
        $query = BlogCategory::query();

        // ソートを適用
        $sortField = $sort['field'] ?? 'sort_order';
        $sortDirection = $sort['direction'] ?? 'asc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage)->withQueryString();
    }
}

