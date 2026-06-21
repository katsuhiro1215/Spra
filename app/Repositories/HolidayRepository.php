<?php

namespace App\Repositories;

use App\Models\Holiday;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class HolidayRepository
{
  /**
   * 基本的なクエリビルダーを取得
   */
  public function query(): Builder
  {
    return Holiday::query();
  }

  /**
   * リレーションを含むクエリを取得
   */
  public function queryWithRelations(): Builder
  {
    return Holiday::with(['createdBy', 'updatedBy']);
  }

  /**
   * 検索条件を適用したクエリを取得
   */
  public function buildSearchQuery(Builder $query, string $search): Builder
  {
    return $query->where(function ($q) use ($search) {
      $q->where('date', 'like', '%' . $search . '%')
        ->orWhere('name', 'like', '%' . $search . '%')
        ->orWhere('type', 'like', '%' . $search . '%')
        ->orWhere('description', 'like', '%' . $search . '%');
    });
  }

  /**
   * typeフィルタを適用
   */
  public function buildTypeFilter(Builder $query, string $type): Builder
  {
    return $query->where('type', $type);
  }

  /**
   * is_recurringフィルタを適用
   */
  public function buildIsRecurringFilter(Builder $query, bool $isRecurring): Builder
  {
    return $query->where('is_recurring', $isRecurring);
  }

  /**
   * 年フィルタを適用
   */
  public function buildYearFilter(Builder $query, int $year): Builder
  {
    return $query->whereYear('date', $year);
  }

  /**
   * 利用可能な年の一覧を取得
   */
  public function getAvailableYears(): array
  {
    return Holiday::selectRaw('YEAR(date) as year')
      ->distinct()
      ->orderBy('year', 'desc')
      ->pluck('year')
      ->toArray();
  }

  /**
   * ソートを適用
   */
  public function applySorting(Builder $query, string $field, string $direction = 'asc'): Builder
  {
    $allowedFields = ['date', 'name', 'type', 'created_at', 'updated_at'];

    if (!in_array($field, $allowedFields)) {
      $field = 'date';
    }

    $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

    return $query->orderBy($field, $direction);
  }

  /**
   * 全ての祝日を取得
   */
  public function getAll(): Collection
  {
    return Holiday::orderBy('date', 'asc')->get();
  }

  /**
   * 全件数を取得
   */
  public function count(): int
  {
    return Holiday::count();
  }

  /**
   * 更新
   */
  public function update(Holiday $holiday, array $data): bool
  {
    return $holiday->update($data);
  }

  /**
   * 削除
   */
  public function delete(Holiday $holiday): bool
  {
    return $holiday->delete();
  }
}
