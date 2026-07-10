<?php

namespace App\Repositories;

use App\Models\ContractGroup;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\Paginator;

class ContractGroupRepository
{
  /**
   * ID でグループを取得
   */
  public function findById(string $id): ?ContractGroup
  {
    return ContractGroup::with([
      'contracts.currentVersion.items',
      'contracts.user.profile',
      'user.profile',
      'creator.profile',
      'quote.currentVersion',
    ])->find($id);
  }

  /**
   * ユーザーのグループ一覧
   */
  public function findByUserId(string $userId): Collection
  {
    return ContractGroup::where('user_id', $userId)
      ->with([
        'contracts.currentVersion',
        'user.profile',
      ])
      ->orderBy('created_at', 'desc')
      ->get();
  }

  /**
   * ステータスで検索
   */
  public function findByStatus(string $status, ?string $userId = null): Collection
  {
    $query = ContractGroup::where('status', $status);

    if ($userId) {
      $query->where('user_id', $userId);
    }

    return $query->with([
      'contracts.currentVersion',
      'user.profile',
    ])
      ->orderBy('created_at', 'desc')
      ->get();
  }

  /**
   * フィルターで検索
   */
  public function findWithFilters(array $filters = []): Paginator
  {
    $query = ContractGroup::query();

    if (!empty($filters['user_id'])) {
      $query->where('user_id', $filters['user_id']);
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (!empty($filters['search'])) {
      $query->where(function ($q) use ($filters) {
        $q->where('group_number', 'like', '%' . $filters['search'] . '%')
          ->orWhere('title', 'like', '%' . $filters['search'] . '%');
      });
    }

    return $query->with([
      'contracts.currentVersion',
      'user.profile',
      'creator.profile',
    ])
      ->orderBy('created_at', 'desc')
      ->paginate($filters['per_page'] ?? 15);
  }

  /**
   * グループを作成
   */
  public function create(array $data): ContractGroup
  {
    return ContractGroup::create($data);
  }

  /**
   * グループを更新
   */
  public function update(ContractGroup $group, array $data): ContractGroup
  {
    $group->update($data);
    return $group->fresh();
  }

  /**
   * グループを削除
   */
  public function delete(ContractGroup $group): bool
  {
    return $group->delete();
  }

  /**
   * 統計情報を取得
   */
  public function getStats(ContractGroup $group): array
  {
    $contracts = $group->contracts()->get();
    $totalAmount = 0;

    foreach ($contracts as $contract) {
      $totalAmount += $contract->currentVersion?->total_amount ?? 0;
    }

    $signedCount = $contracts->filter(
      fn($c) =>
      $c->signature_status === 'signed'
    )->count();

    return [
      'total_contracts' => $contracts->count(),
      'signed_contracts' => $signedCount,
      'pending_contracts' => $contracts->count() - $signedCount,
      'total_amount' => $totalAmount,
    ];
  }
}
