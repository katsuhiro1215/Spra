<?php

namespace App\Repositories\Contracts;

use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface ServiceTypeRepositoryInterface
{
  /**
   * 基本的なクエリビルダーを取得
   */
  public function query(): Builder;

  /**
   * リレーションを含むクエリを取得
   */
  public function queryWithRelations(): Builder;

  /**
   * 複数条件でのフィルタリング
   */
  public function findWithFilters(array $filters): Builder;

  /**
   * アクティブなサービスタイプを取得
   */
  public function findActive(): Collection;

  /**
   * おすすめサービスタイプを取得
   */
  public function findFeatured(int $limit = null): Collection;

  /**
   * カテゴリ別のサービスタイプを取得
   */
  public function findByCategory(int $categoryId): Collection;

  /**
   * 親サービスを持たないトップレベルサービスを取得
   */
  public function findTopLevel(): Collection;

  /**
   * 子サービスを取得
   */
  public function findChildren(int $parentId): Collection;

  /**
   * 最大ソート順序を取得
   */
  public function getMaxSortOrder(): int;

  /**
   * スラッグの重複チェック
   */
  public function isSlugUnique(string $slug, ?int $excludeId = null): bool;

  /**
   * 一括更新
   */
  public function bulkUpdate(array $ids, array $data): int;

  /**
   * 一括削除
   */
  public function bulkDelete(array $ids): int;
}
