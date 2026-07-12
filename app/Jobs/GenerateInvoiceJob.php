<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

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
  public function handle(InvoiceService $invoiceService): void
  {
    try {
      $this->generateInvoice($invoiceService);
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
  private function generateInvoice(InvoiceService $invoiceService): void
  {
    // 既存の請求書がある場合はスキップ
    if ($this->contract->invoices()->exists()) {
      return;
    }

    $this->contract->loadMissing('currentVersion.items');
    $currentVersion = $this->contract->currentVersion;

    // 請求日を計算
    $issueDate = now();
    if ($this->delayDays) {
      $issueDate = now()->addDays($this->delayDays);
    }

    $subtotal = (float) ($currentVersion?->total_amount ?? 0);
    $taxRate = (float) ($currentVersion?->tax_rate ?? 0);
    $taxAmount = round($subtotal * $taxRate / 100, 2);
    $totalAmount = $subtotal + $taxAmount;

    // 請求書作成
    $invoice = Invoice::create([
      'invoice_number' => $invoiceService->generateInvoiceNumber(),
      'invoice_type' => 'full',
      'issue_date' => $issueDate->toDateString(),
      'contract_id' => $this->contract->id,
      'user_id' => $this->contract->user_id,
      'company_id' => $this->contract->company_id,
      'billing_period_start' => $this->contract->start_date,
      'billing_period_end' => $this->contract->end_date,
      'subtotal' => $subtotal,
      'tax_rate' => $taxRate,
      'tax_amount' => $taxAmount,
      'total_amount' => $totalAmount,
      'status' => 'draft',
      'due_date' => $issueDate->copy()->addDays(30)->toDateString(),
      'created_by' => null,
    ]);

    if ($currentVersion) {
      $invoiceService->snapshotItemsFromContract($invoice, $currentVersion);
    }

    // 履歴記録
    $this->contract->histories()->create([
      'action' => 'invoice_generated',
      'message' => "請求書が自動生成されました: {$invoice->invoice_number}",
      'status' => 'completed',
      'created_by' => null,
    ]);

    // 請求書メール送付ジョブをディスパッチ（自動送付）
    SendInvoiceJob::dispatch($invoice);
  }
}
