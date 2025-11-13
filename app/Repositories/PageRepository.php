<?php

namespace App\Repositories;

use App\Models\Page;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class PageRepository
{
    /**
     * 基本的なクエリビルダーを取得
     */
    public function query(): Builder
    {
        return Page::query();
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
     * すべてのページを取得
     */
    public function getAll(): Builder
    {
        return Page::with(['createdBy', 'updatedBy']);
    }
}