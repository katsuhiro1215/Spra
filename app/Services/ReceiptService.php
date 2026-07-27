<?php

namespace App\Services;

use App\Models\Receipt;
use App\Models\Invoice;
use App\Models\Payment;
use App\Mail\ReceiptMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptService
{
  public function __construct(
    private PointService $pointService,
  ) {}

  /**
   * 入金確認後に領収書を発行
   * Invoice1件につき領収書は1件のみ(既に発行済みの場合はそれを返す)
   */
  public function issueReceipt(Invoice $invoice, ?Payment $payment = null): Receipt
  {
    return DB::transaction(function () use ($invoice, $payment) {
      $existing = $invoice->receipt()->first();
      if ($existing) {
        return $existing;
      }

      // 領収書作成
      $receipt = Receipt::create([
        'receipt_number' => $this->generateReceiptNumber(),
        'invoice_id' => $invoice->id,
        'payment_id' => $payment?->id,
        'user_id' => $invoice->user_id,
        'company_id' => $invoice->company_id,
        'amount' => $invoice->subtotal,
        'tax_amount' => $invoice->tax_amount,
        'total_amount' => $invoice->total_amount,
        'status' => 'draft',
        'issued_at' => now(),
        'created_by' => auth()->guard('admins')->id(),
      ]);

      // ポイント付与はここが入金確認の実質的なタイミング(Receiptがdraftで作られた瞬間)。
      // 失敗しても領収書の発行自体は妨げないよう、内側のトランザクション(セーブポイント)ごと
      // 握りつぶす。
      try {
        $this->pointService->grantForReceipt($receipt);
      } catch (\Throwable $e) {
        Log::error('ポイント付与に失敗しました', [
          'receipt_id' => $receipt->id,
          'error' => $e->getMessage(),
        ]);
      }

      return $receipt;
    });
  }

  /**
   * 領収書のPDFを生成して保存
   */
  public function generateAndSavePdf(Receipt $receipt): string
  {
    // PDF生成(A4・縦向き。指定がないとDomPDFのデフォルト用紙(Letter)になり
    // 実際のA4用紙より横幅が広くレイアウトが間延びして見えるため明示する)
    $pdf = Pdf::loadView('pdfs.receipt', [
      'receipt' => $receipt->load(['user.profile', 'company', 'invoice.contract']),
    ])->setPaper('A4', 'portrait');
    \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

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
   * 複数の領収書をまとめた1つのPDFを生成（保存はせずバイナリを返す）
   */
  public function generateBulkPdfContent(\Illuminate\Support\Collection $receipts): string
  {
    $receipts->loadMissing(['user.profile', 'company', 'invoice.contract']);

    $pdf = Pdf::loadView('pdfs.receipts-bulk', [
      'receipts' => $receipts,
    ])->setPaper('A4', 'portrait');
    \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

    return $pdf->output();
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
    // withTrashed: 論理削除された領収書の番号も含めて重複を避ける
    // (receipt_number にはユニーク制約があるため、除外すると採番が衝突しうる)
    $lastReceipt = Receipt::withTrashed()
      ->whereYear('created_at', $year)
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
