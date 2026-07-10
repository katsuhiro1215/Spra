<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class GenerateInvoiceJob implements ShouldQueue
{
  use Queueable;

  public Contract $contract;
  public ?int $delayDays = null;

  /**
   * Create a new job instance.
   *
   * @param Contract $contract
   * @param int|null $delayDays 請求書生成の遅延日数（null=即座）
   */
  public function __construct(Contract $contract, ?int $delayDays = null)
  {
    $this->contract = $contract;
    $this->delayDays = $delayDays;
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    try {
      $this->generateInvoice();
    } catch (\Exception $e) {
      // ログ出力と履歴記録
      $this->contract->histories()->create([
        'action' => 'invoice_generation_failed',
        'message' => $e->getMessage(),
        'status' => 'failed',
        'created_by' => null,
      ]);

      throw $e;
    }
  }

  /**
   * 請求書を生成
   */
  private function generateInvoice(): void
  {
    // 既存の請求書がある場合はスキップ
    if ($this->contract->invoices()->exists()) {
      return;
    }

    // 請求日を計算
    $issueDate = now();
    if ($this->delayDays) {
      $issueDate = now()->addDays($this->delayDays);
    }

    // 請求書番号を生成（YYYY-MM-連番）
    $invoiceNumber = $this->generateInvoiceNumber();

    // 請求書作成
    $invoice = Invoice::create([
      'invoice_number' => $invoiceNumber,
      'issue_date' => $issueDate->toDateString(),
      'contract_id' => $this->contract->id,
      'user_id' => $this->contract->user_id,
      'company_id' => $this->contract->company_id,
      'billing_period_start' => $this->contract->start_date,
      'billing_period_end' => $this->contract->end_date,
      'subtotal' => $this->contract->current_version?->total_amount || 0,
      'tax_rate' => $this->contract->current_version?->tax_rate ?? 0,
      'tax_amount' => round(($this->contract->current_version?->total_amount || 0) * ($this->contract->current_version?->tax_rate ?? 0) / 100, 2),
      'total_amount' => ($this->contract->current_version?->total_amount || 0) + round(($this->contract->current_version?->total_amount || 0) * ($this->contract->current_version?->tax_rate ?? 0) / 100, 2),
      'status' => 'draft',
      'due_date' => $issueDate->copy()->addDays(30)->toDateString(),
      'created_by' => null,
    ]);

    // 履歴記録
    $this->contract->histories()->create([
      'action' => 'invoice_generated',
      'message' => "請求書が自動生成されました: {$invoiceNumber}",
      'status' => 'completed',
      'created_by' => null,
    ]);

    // 請求書メール送付ジョブをディスパッチ（自動送付）
    SendInvoiceJob::dispatch($invoice);
  }

  /**
   * 請求書番号を生成（YYYY-MM-連番）
   */
  private function generateInvoiceNumber(): string
  {
    $prefix = now()->format('Ym');
    $count = Invoice::where('invoice_number', 'like', "{$prefix}%")->count() + 1;

    return sprintf('%s-%05d', $prefix, $count);
  }
}
