<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Contract;
use App\Models\ContractBenefit;
use App\Models\ContractBenefitUsage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * 契約特典（チケット）の付与・消費・返却を管理するサービス
 */
class ContractBenefitService
{
  public const DEFAULT_BENEFIT_TYPE = 'meeting';

  /**
   * 契約が持つ特典設定（ServiceItemの benefit_* フィールド）を取得する。
   * 現在有効なContractVersionのContractItemのうち、特典を付与するものを合算する。
   *
   * @return array{ticketsPerPeriod: int, unitMinutes: int|null}|null
   */
  public function resolveBenefitConfig(Contract $contract, string $benefitType = self::DEFAULT_BENEFIT_TYPE): ?array
  {
    $version = $contract->currentVersion ?? $contract->versions()->latest('version')->first();

    if (!$version) {
      return null;
    }

    $items = $version->items()->with('serviceItem')->get()
      ->filter(fn($item) => $item->serviceItem
        && $item->serviceItem->grantsBenefit()
        && $item->serviceItem->benefit_type === $benefitType);

    if ($items->isEmpty()) {
      return null;
    }

    $ticketsPerPeriod = 0;
    $unitMinutes = null;

    foreach ($items as $item) {
      $ticketsPerPeriod += $item->serviceItem->benefit_ticket_count * (int) $item->quantity;
      $unitMinutes ??= $item->serviceItem->benefit_unit_minutes;
    }

    if ($ticketsPerPeriod <= 0) {
      return null;
    }

    return [
      'ticketsPerPeriod' => $ticketsPerPeriod,
      'unitMinutes' => $unitMinutes,
    ];
  }

  /**
   * 契約有効化時の初回特典生成。
   * 有期契約（end_dateあり）は契約期間の月ごとに一括生成、
   * 継続契約（end_dateなし）は当月分のみ生成する。
   */
  public function generateInitialBenefits(Contract $contract, string $benefitType = self::DEFAULT_BENEFIT_TYPE): void
  {
    $config = $this->resolveBenefitConfig($contract, $benefitType);

    if (!$config) {
      return;
    }

    $startDate = Carbon::parse($contract->start_date)->startOfMonth();

    if ($contract->end_date) {
      $endDate = Carbon::parse($contract->end_date)->startOfMonth();
      $cursor = $startDate->copy();

      while ($cursor->lte($endDate)) {
        $this->createBatchIfMissing($contract, $benefitType, $cursor, $config, carriedOver: 0);
        $cursor->addMonthNoOverflow();
      }
    } else {
      $this->createBatchIfMissing($contract, $benefitType, $startDate, $config, carriedOver: 0);
    }
  }

  /**
   * 継続契約向けの翌期間分の特典生成（毎日のスケジュールコマンドから呼ばれる）。
   * 前期間の残数のうち、ServicePlanのmax_carryover_ticketsを上限に繰り越す。
   */
  public function generateNextPeriodBenefits(Contract $contract, string $benefitType = self::DEFAULT_BENEFIT_TYPE): void
  {
    $config = $this->resolveBenefitConfig($contract, $benefitType);

    if (!$config) {
      return;
    }

    $periodStart = now()->startOfMonth();
    $periodLabel = $periodStart->format('Y-m');

    $alreadyExists = ContractBenefit::where('contract_id', $contract->id)
      ->where('benefit_type', $benefitType)
      ->where('period_label', $periodLabel)
      ->exists();

    if ($alreadyExists) {
      return;
    }

    DB::transaction(function () use ($contract, $benefitType, $periodStart, $config) {
      $previousBatch = ContractBenefit::where('contract_id', $contract->id)
        ->where('benefit_type', $benefitType)
        ->active()
        ->lockForUpdate()
        ->orderByDesc('period_start')
        ->first();

      $carriedOver = 0;

      if ($previousBatch) {
        $maxCarryover = $contract->servicePlan?->max_carryover_tickets;
        $remaining = $previousBatch->remainingQuantity();

        if ($maxCarryover && $remaining > 0) {
          $carriedOver = min($remaining, $maxCarryover);
        }

        $previousBatch->update(['status' => 'expired']);
      }

      $this->createBatchIfMissing($contract, $benefitType, $periodStart, $config, $carriedOver);
    });
  }

  private function createBatchIfMissing(
    Contract $contract,
    string $benefitType,
    Carbon $periodStart,
    array $config,
    int $carriedOver,
  ): ?ContractBenefit {
    $periodLabel = $periodStart->format('Y-m');

    $exists = ContractBenefit::where('contract_id', $contract->id)
      ->where('benefit_type', $benefitType)
      ->where('period_label', $periodLabel)
      ->exists();

    if ($exists) {
      return null;
    }

    return ContractBenefit::create([
      'contract_id' => $contract->id,
      'contract_version_id' => $contract->current_version_id,
      'benefit_type' => $benefitType,
      'unit_minutes' => $config['unitMinutes'],
      'period_label' => $periodLabel,
      'period_start' => $periodStart->copy()->startOfMonth(),
      'period_end' => $periodStart->copy()->endOfMonth(),
      'granted_quantity' => $config['ticketsPerPeriod'],
      'carried_over_quantity' => $carriedOver,
      'used_quantity' => 0,
      'status' => 'active',
    ]);
  }

  /**
   * 契約の利用可能なチケット残数（有効なバッチの合算）
   */
  public function availableBalance(Contract $contract, string $benefitType = self::DEFAULT_BENEFIT_TYPE): int
  {
    return ContractBenefit::where('contract_id', $contract->id)
      ->where('benefit_type', $benefitType)
      ->active()
      ->get()
      ->sum(fn(ContractBenefit $batch) => max(0, $batch->remainingQuantity()));
  }

  /**
   * チケットを消費する（悲観的ロックで排他制御、複数バッチにまたがる場合は古い期間から消費）。
   *
   * @throws \RuntimeException チケットが不足している場合
   */
  public function consume(Contract $contract, Appointment $appointment, int $quantity = 1, string $benefitType = self::DEFAULT_BENEFIT_TYPE): void
  {
    DB::transaction(function () use ($contract, $appointment, $quantity, $benefitType) {
      $batches = ContractBenefit::where('contract_id', $contract->id)
        ->where('benefit_type', $benefitType)
        ->active()
        ->orderBy('period_start')
        ->lockForUpdate()
        ->get();

      $remainingToConsume = $quantity;

      foreach ($batches as $batch) {
        if ($remainingToConsume <= 0) {
          break;
        }

        $available = $batch->remainingQuantity();
        if ($available <= 0) {
          continue;
        }

        $consumeFromBatch = min($available, $remainingToConsume);

        $batch->increment('used_quantity', $consumeFromBatch);

        ContractBenefitUsage::create([
          'contract_benefit_id' => $batch->id,
          'appointment_id' => $appointment->id,
          'quantity_used' => $consumeFromBatch,
          'used_at' => now(),
        ]);

        $remainingToConsume -= $consumeFromBatch;
      }

      if ($remainingToConsume > 0) {
        throw new \RuntimeException('チケットが不足しています。');
      }
    });
  }

  /**
   * 予約キャンセル時のチケット返却。
   * ミーティング開始まで設定時間（デフォルト1時間）を切っている場合は返却しない。
   * $ignoreCutoff=true の場合（Adminによるキャンセル等）は常に返却する。
   */
  public function refund(Appointment $appointment, bool $ignoreCutoff = false): void
  {
    $slot = $appointment->appointmentSlot;

    if (!$ignoreCutoff && $slot) {
      $startsAt = Carbon::parse($slot->date->format('Y-m-d') . ' ' . $slot->start_time);
      $cutoffHours = config('appointments.benefit_refund_cutoff_hours', 1);

      if (now()->diffInMinutes($startsAt, false) < $cutoffHours * 60) {
        return;
      }
    }

    DB::transaction(function () use ($appointment) {
      $usages = ContractBenefitUsage::where('appointment_id', $appointment->id)
        ->whereNull('reversed_at')
        ->lockForUpdate()
        ->get();

      foreach ($usages as $usage) {
        $batch = ContractBenefit::lockForUpdate()->find($usage->contract_benefit_id);
        $batch?->decrement('used_quantity', $usage->quantity_used);

        $usage->update([
          'reversed_at' => now(),
          'reversed_reason' => 'appointment_cancelled',
        ]);
      }
    });
  }
}
