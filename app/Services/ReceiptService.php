<?php

namespace App\Services;

use App\Models\Receipt;
use App\Models\Invoice;
use App\Models\Payment;
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
        'amount' => $invoice->amount,
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
}
