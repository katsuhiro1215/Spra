<?php

namespace App\Repositories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class FaqRepository
{
    /**
     * 基本的なクエリビルダーを取得
     */
    public function query(): Builder
    {
        return Faq::query();
    }

    /**
     * リレーションを含むクエリを取得
     */
    public function queryWithRelations(): Builder
    {
        return Faq::with(['faqCategory', 'createdBy', 'updatedBy']);
    }

  /**
   * 検索条件を適用したクエリを取得
   */
    public function buildSearchQuery(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('question', 'like', '%' . $search . '%')
              ->orWhere('answer', 'like', '%' . $search . '%');
        });
    }

    /**
     * カテゴリフィルターを適用
     */
    public function buildCategoryFilter(Builder $query, int $categoryId): Builder
    {
        return $query->where('faq_category_id', $categoryId);
    }

    /**
     * ソートを適用
     */
    public function applySorting(Builder $query, string $field, string $direction): Builder
    {
        $allowedSortFields = ['question', 'created_at', 'updated_at', 'sort_order'];

        if (in_array($field, $allowedSortFields)) {
            return $query->orderBy($field, $direction);
        }

        return $query->orderBy('sort_order', 'asc');
    }

    /**
     * 複数条件でのフィルタリング（Fluent Interface）
     */
    public function findWithFilters(array $filters): Builder
    {
        $query = $this->queryWithRelations();

        if (!empty($filters['search'])) {
            $query = $this->buildSearchQuery($query, $filters['search']);
        }

        if (!empty($filters['category_id'])) {
            $query = $this->buildCategoryFilter($query, $filters['category_id']);
        }

        return $query;
    }

    /**
     * 公開中のFAQを取得
     */
    public function findActive(): Collection
    {
        return Faq::where('is_published', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * カテゴリ別で公開中のFAQを取得
     */
    public function findByCategory(int $categoryId): Collection
    {
        return Faq::where('faq_category_id', $categoryId)
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * 最大ソート順序を取得
     */
    public function getMaxSortOrder(): int
    {
        return Faq::max('sort_order') ?? 0;
    }
}
