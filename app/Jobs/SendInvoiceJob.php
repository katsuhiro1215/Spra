<?php

namespace App\Jobs;

use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

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
  public function handle(): void
  {
    try {
      if (!$this->invoice->user || !$this->invoice->user->email) {
        throw new \Exception('ユーザーメールアドレスが登録されていません。');
      }

      Mail::send('emails.invoice-notification', [
        'invoice' => $this->invoice,
        'user' => $this->invoice->user,
        'contract' => $this->invoice->contract,
      ], function ($message) {
        $message->to($this->invoice->user->email)
          ->subject("【請求書】{$this->invoice->invoice_number} - {$this->invoice->contract->title}");
      });

      // ステータス（sent）は既に Controller 側で更新済み

      // 契約履歴記録
      $this->invoice->contract->histories()->create([
        'action' => 'invoice_sent',
        'recipient_email' => $this->invoice->user->email,
        'subject' => "請求書送付: {$this->invoice->invoice_number}",
        'message' => "請求書が送付されました: {$this->invoice->invoice_number}",
        'status' => 'sent',
        'sent_at' => now(),
        'created_by' => null,
      ]);
    } catch (\Exception $e) {
      // 履歴記録
      $this->invoice->contract->histories()->create([
        'action' => 'invoice_send_failed',
        'recipient_email' => $this->invoice->user?->email ?? 'unknown',
        'subject' => "請求書送付失敗: {$this->invoice->invoice_number}",
        'message' => $e->getMessage(),
        'status' => 'failed',
        'created_by' => null,
      ]);

      throw $e;
    }
  }
}
