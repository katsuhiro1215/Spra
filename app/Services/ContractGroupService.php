<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\ContractGroup;
use App\Models\Quote;
use Illuminate\Support\Facades\DB;

class ContractGroupService
{
  /**
   * 複数の Contract からグループを作成
   * @param array $contractIds - Contract ID のリスト
   * @param string $title - グループのタイトル
   * @param ?string $description - グループの説明
   * @param ?string $createdById - 作成者の Admin ID
   * @return ContractGroup
   */
  public function createGroupFromContracts(
    array $contractIds,
    string $title,
    ?string $description = null,
    ?string $createdById = null
  ): ContractGroup {
    return DB::transaction(function () use ($contractIds, $title, $description, $createdById) {
      // 最初の Contract から情報を取得
      $firstContract = Contract::findOrFail($contractIds[0]);

      // グループを作成
      $group = ContractGroup::create([
        'group_number' => ContractGroup::generateGroupNumber(),
        'quote_id' => $firstContract->quote_id,
        'user_id' => $firstContract->user_id,
        'company_id' => $firstContract->company_id,
        'title' => $title,
        'description' => $description,
        'status' => 'active',
        'created_by' => $createdById,
      ]);

      // 各 Contract をグループに関連付け
      Contract::whereIn('id', $contractIds)
        ->update(['contract_group_id' => $group->id]);

      return $group;
    });
  }

  /**
   * Quote から複数の Contract とグループを作成
   * 複数サービスを分割契約する場合に使用
   *
   * @param Quote $quote
   * @param array $serviceConfigs - [['service_id', 'title', 'items'], ...]
   * @param ?string $createdById
   * @return ContractGroup
   */
  public function createGroupFromQuoteMultiServices(
    Quote $quote,
    array $serviceConfigs,
    ?string $createdById = null
  ): ContractGroup {
    return DB::transaction(function () use ($quote, $serviceConfigs, $createdById) {
      $contractService = new ContractService();
      $contractIds = [];

      // 各サービスごとに Contract を作成
      foreach ($serviceConfigs as $config) {
        $contract = $contractService->createContract(
          user_id: $quote->user_id,
          quote_id: $quote->id,
          title: $config['title'],
          description: $config['description'] ?? null,
          items: $config['items'],
          created_by: $createdById,
        );
        $contractIds[] = $contract->id;
      }

      // グループを作成
      $group = ContractGroup::create([
        'group_number' => ContractGroup::generateGroupNumber(),
        'quote_id' => $quote->id,
        'user_id' => $quote->user_id,
        'company_id' => $quote->company_id,
        'title' => $quote->title,
        'description' => '複数サービス統合契約',
        'status' => 'active',
        'created_by' => $createdById,
      ]);

      // 各 Contract をグループに関連付け
      Contract::whereIn('id', $contractIds)
        ->update(['contract_group_id' => $group->id]);

      return $group;
    });
  }

  /**
   * グループ全体を送信
   * @param ContractGroup $group
   * @param string $recipientEmail
   * @param ?string $createdById
   * @return bool
   */
  public function sendGroup(
    ContractGroup $group,
    string $recipientEmail,
    ?string $createdById = null
  ): bool {
    return DB::transaction(function () use ($group, $recipientEmail, $createdById) {
      // グループ内の全ての Contract を送信
      foreach ($group->contracts as $contract) {
        // 各契約書のステータスを pending_signature に更新
        $contract->update(['status' => 'pending_signature']);

        // グループ全体のステータスを更新
        if ($group->contracts->where('status', '!=', 'pending_signature')->isEmpty()) {
          $group->update(['status' => 'active']);
        }
      }

      // メールを送信（ContractGroupMailJob の実装を後から行う）
      \Illuminate\Support\Facades\Bus::dispatch(
        new \App\Jobs\ContractGroupMailJob(
          $group,
          $recipientEmail,
          $createdById
        )
      );

      return true;
    });
  }

  /**
   * グループのステータスを更新
   */
  public function updateGroupStatus(ContractGroup $group): ContractGroup
  {
    $contracts = $group->contracts()->get();
    $statuses = $contracts->pluck('status')->unique();

    if ($statuses->count() === 1) {
      $status = $statuses->first();
      if ($status === 'active') {
        $group->update(['status' => 'active']);
      } elseif ($status === 'completed') {
        $group->update(['status' => 'completed']);
      } elseif ($status === 'cancelled') {
        $group->update(['status' => 'cancelled']);
      }
    } else {
      $group->update(['status' => 'partially_active']);
    }

    return $group;
  }

  /**
   * グループを解除（Contract から contract_group_id を削除）
   */
  public function removeGroupAssociation(ContractGroup $group): bool
  {
    return DB::transaction(function () use ($group) {
      Contract::where('contract_group_id', $group->id)
        ->update(['contract_group_id' => null]);

      $group->delete();
      return true;
    });
  }

  /**
   * グループに Contract を追加
   */
  public function addContractToGroup(ContractGroup $group, Contract $contract): Contract
  {
    // 異なるユーザーの Contract は追加できない
    if ($contract->user_id !== $group->user_id) {
      throw new \Exception('異なるユーザーの契約書はグループに追加できません');
    }

    $contract->update(['contract_group_id' => $group->id]);
    $this->updateGroupStatus($group);

    return $contract;
  }

  /**
   * グループから Contract を削除
   */
  public function removeContractFromGroup(Contract $contract): Contract
  {
    $group = $contract->contractGroup;
    $contract->update(['contract_group_id' => null]);

    if ($group) {
      $this->updateGroupStatus($group);
    }

    return $contract;
  }

  /**
   * グループの統計情報を取得
   */
  public function getGroupStats(ContractGroup $group): array
  {
    $contracts = $group->contracts()->get();
    $versions = $contracts->flatMap(fn($c) => $c->versions)->all();

    $totalAmount = collect($versions)
      ->filter(fn($v) => $v->is_current)
      ->sum('total_amount');

    $signedCount = $contracts->where('signature_status', 'fully_signed')->count();
    $pendingCount = $contracts->whereIn('signature_status', ['pending', 'user_signed'])->count();

    return [
      'total_contracts' => $contracts->count(),
      'signed_contracts' => $signedCount,
      'pending_contracts' => $pendingCount,
      'total_amount' => $totalAmount,
      'average_amount' => $contracts->count() > 0 ? $totalAmount / $contracts->count() : 0,
    ];
  }
}
