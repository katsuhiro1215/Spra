<?php

namespace App\Services;

use App\Models\Receipt;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Mail\ReceiptMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptService
{
  /**
   * 入金確認後に領収書を発行
   */
  public function issueReceipt(Invoice $invoice, ?Payment $payment = null): Receipt
  {
    return DB::transaction(function () use ($invoice, $payment) {
      // 領収書番号を生成
      $receiptNumber = $this->generateReceiptNumber();

      // 領収書作成
      $receipt = Receipt::create([
        'receipt_number' => $receiptNumber,
        'invoice_id' => $invoice->id,
        'payment_id' => $payment?->id,
        'user_id' => $invoice->user_id,
        'company_id' => $invoice->company_id,
        'amount' => $invoice->subtotal,
        'tax_amount' => $invoice->tax_amount,
        'total_amount' => $invoice->total_amount,
        'status' => 'draft',
        'issued_at' => now(),
        'created_by' => auth()->guard('admins')->id() ?? 'system',
      ]);

      return $receipt;
    });
  }

  /**
   * 領収書のPDFを生成して保存
   */
  public function generateAndSavePdf(Receipt $receipt): string
  {
    // PDF生成
    $pdf = Pdf::loadView('pdf.receipt', [
      'receipt' => $receipt->load(['user', 'company', 'invoice']),
    ]);

    // 保存パス生成
    $directory = "receipts/{$receipt->user_id}";
    $filename = "receipt_{$receipt->receipt_number}_" . now()->format('YmdHis') . ".pdf";
    $path = "{$directory}/{$filename}";

    // プライベートディスクに保存
    Storage::disk('private')->put($path, $pdf->output());

    // Receiptモデルのpdf_pathを更新
    $receipt->update(['pdf_path' => $path]);

    return $path;
  }

  /**
   * 領収書を発行して送付
   */
  public function sendReceipt(Receipt $receipt): bool
  {
    return DB::transaction(function () use ($receipt) {
      // PDFがまだ生成されていなければ生成
      if (!$receipt->pdf_path) {
        $this->generateAndSavePdf($receipt);
        $receipt->refresh();
      }

      // メール送信
      Mail::to($receipt->user->email)->send(new ReceiptMail($receipt));

      // ステータスを送付済みに更新
      $receipt->update([
        'status' => 'sent',
        'sent_at' => now(),
      ]);

      return true;
    });
  }

  /**
   * 領収書番号を生成
   */
  private function generateReceiptNumber(): string
  {
    $year = date('Y');
    $lastReceipt = Receipt::whereYear('created_at', $year)
      ->orderBy('receipt_number', 'desc')
      ->first();

    if ($lastReceipt && preg_match('/RCP(\d{4})-(\d+)/', $lastReceipt->receipt_number, $matches)) {
      $nextNumber = intval($matches[2]) + 1;
    } else {
      $nextNumber = 1;
    }

    return sprintf('RCP%s-%04d', $year, $nextNumber);
  }

  /**
   * 支払い通知を作成
   */
  public function createPaymentNotification(Invoice $invoice, array $data): PaymentNotification
  {
    return PaymentNotification::create([
      'invoice_id'      => $invoice->id,
      'user_id'         => $invoice->user_id,
      'company_id'      => $invoice->company_id,
      'payment_method'  => $data['payment_method'],
      'amount'          => $data['amount'],
      'payment_date'    => $data['payment_date'],
      'transaction_id'  => $data['transaction_id'] ?? null,
      'notes'           => $data['notes'] ?? null,
      'status'          => 'pending',
    ]);
  }

  /**
   * 支払い通知を確認（Admin操作）
   */
  public function acknowledgePaymentNotification(PaymentNotification $notification, string $adminId): void
  {
    $notification->acknowledge($adminId);
  }

  /**
   * ペンディング中の支払い通知を取得（Admin用）
   */
  public function getPendingPaymentNotifications()
  {
    return PaymentNotification::pending()
      ->with(['invoice', 'user', 'company'])
      ->orderBy('created_at', 'desc')
      ->get();
  }

  /**
   * 支払い通知の数を取得
   */
  public function getPendingPaymentNotificationsCount(): int
  {
    return PaymentNotification::pending()->count();
  }
}
