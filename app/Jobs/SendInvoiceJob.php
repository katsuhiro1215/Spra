<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendInvoiceJob implements ShouldQueue
{
  use Queueable;

  public Invoice $invoice;

  /**
   * Create a new job instance.
   */
  public function __construct(Invoice $invoice)
  {
    $this->invoice = $invoice;
  }

  /**
   * Execute the job.
   */
  public function handle(InvoiceService $invoiceService): void
  {
    // 実際のPDF生成・メール送信(InvoiceMail)・ステータス更新・履歴記録は
    // InvoiceService::sendInvoice()に集約されている(SendPendingInvoicesコマンド・
    // 再送信でも同じ実装を使用)。以前はここで独自にMail::send('emails.invoice-notification', ...)
    // を直接呼んでおり、装飾の無いプレーンテキストメール(かつ存在しない$user->nameを
    // 参照)が送信される不具合があった。
    $invoiceService->sendInvoice($this->invoice);
  }
}
