<?php

namespace App\Repositories;

use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class BlogCategoryRepository
{
    /**
     * 基本的なクエリビルダーを取得
     */
    public function query(): Builder
    {
        return BlogCategory::query();
    }

  /**
   * 検索条件を適用したクエリを取得
   */
    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
              ->orWhere('description', 'like', '%' . $search . '%');
        });
    }

    /**
     * すべてのブログカテゴリを取得
   */
    public function getAll(): Builder
    {
        return BlogCategory::with(['createdBy', 'updatedBy']);
    }
}