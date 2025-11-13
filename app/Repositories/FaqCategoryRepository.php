<?php

namespace App\Repositories;

use App\Models\FaqCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class FaqCategoryRepository
{
    /**
     * 基本的なクエリビルダーを取得
     */
    public function query(): Builder
    {
        return FaqCategory::query();
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
     * すべてのFAQを取得
   */
    public function getAll(): Builder
    {
        return FaqCategory::with(['createdBy', 'updatedBy']);
    }
}