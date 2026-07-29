<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Invoice;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\InvoiceRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService extends BaseService
{
  public function __construct(
    PaymentRepositoryInterface $repository,
    private InvoiceRepository $invoiceRepository,
    private ReceiptService $receiptService,
  ) {
    parent::__construct($repository);
  }

  protected function getEntityName(): string
  {
    return 'Payment';
  }

  /**
   * 支払いを作成し、請求書のステータスを更新
   */
  public function create(array $data): Payment
  {
    return DB::transaction(function () use ($data) {
      $payment = $this->repository->create($data);

      // 請求書が存在する場合、支払い状況を確認して更新
      if ($payment->invoice_id) {
        $this->updateInvoiceStatus($payment->invoice);
      }

      Log::info('Payment created', ['payment_id' => $payment->id]);

      return $payment;
    });
  }

  /**
   * 支払いを更新し、請求書のステータスを更新
   *
   * @param Payment $model
   */
  public function update(mixed $model, array $data): mixed
  {
    return DB::transaction(function () use ($model, $data) {
      $payment = $model;
      $updated = $this->repository->update($payment, $data);

      // 請求書のステータスを更新
      if ($updated->invoice_id) {
        $this->updateInvoiceStatus($updated->invoice);
      }

      Log::info('Payment updated', ['payment_id' => $updated->id]);

      return $updated;
    });
  }

  /**
   * 支払いを確認済みにする
   */
  public function confirm(Payment $payment, string $confirmedByAdminId): Payment
  {
    return DB::transaction(function () use ($payment, $confirmedByAdminId) {
      $confirmed = $this->repository->confirm($payment, $confirmedByAdminId);

      // 請求書のステータスを更新
      if ($confirmed->invoice_id) {
        $this->updateInvoiceStatus($confirmed->invoice);
      }

      Log::info('Payment confirmed', [
        'payment_id' => $confirmed->id,
        'confirmed_by' => $confirmedByAdminId
      ]);

      return $confirmed;
    });
  }

  /**
   * 支払いを削除
   *
   * @param Payment $model
   */
  public function delete(mixed $model): bool
  {
    return DB::transaction(function () use ($model) {
      $payment = $model;
      $invoice = $payment->invoice;
      $deleted = $payment->delete();

      // 請求書が存在する場合、ステータスを更新
      if ($invoice) {
        $this->updateInvoiceStatus($invoice);
      }

      Log::info('Payment deleted', ['payment_id' => $payment->id]);

      return $deleted;
    });
  }

  /**
   * 請求書に対する支払い総額を計算してステータスを更新
   * 新たに支払済みになった場合は領収書を自動発行・送付する
   */
  protected function updateInvoiceStatus(Invoice $invoice): void
  {
    $wasPaid = $invoice->status === 'paid';

    // 完了した支払いの合計を計算
    $totalPaid = $invoice->payments()
      ->where('status', 'completed')
      ->sum('amount');

    // 支払い状況に応じてステータスを更新
    if ($totalPaid >= $invoice->total_amount) {
      $this->invoiceRepository->update($invoice, [
        'status' => 'paid',
        'paid_at' => now(),
      ]);

      if (!$wasPaid) {
        $this->issueReceiptForInvoice($invoice);
      }
    } elseif ($wasPaid) {
      // 支払い済みだったが不足している場合は元に戻す
      $this->invoiceRepository->update($invoice, [
        'status' => 'sent',
        'paid_at' => null,
      ]);
    }
  }

  /**
   * 支払済みになった請求書の領収書を自動発行する（下書きとして作成するのみ）
   * 既に発行済みの場合は何もしない(冪等)
   *
   * 送信までは自動で行わない。金額や宛名に誤りがないか管理者が内容を確認してから
   * 明示的に送信する運用のため（ReceiptController::send() / 領収書詳細画面）。
   */
  private function issueReceiptForInvoice(Invoice $invoice): void
  {
    if ($invoice->receipt) {
      return;
    }

    try {
      $latestPayment = $invoice->payments()
        ->where('status', 'completed')
        ->latest('payment_date')
        ->first();

      $this->receiptService->issueReceipt($invoice, $latestPayment);
    } catch (\Exception $e) {
      Log::error('領収書の自動発行に失敗しました', [
        'invoice_id' => $invoice->id,
        'error' => $e->getMessage(),
      ]);
    }
  }

  /**
   * 請求書IDで支払い一覧を取得
   */
  public function getByInvoiceId(string $invoiceId): Collection
  {
    return Payment::where('invoice_id', $invoiceId)
      ->with(['confirmedBy'])
      ->orderBy('payment_date', 'desc')
      ->get();
  }

  /**
   * 統計情報を取得
   */
  public function getStats(): array
  {
    return [
      'total' => Payment::count(),
      'pending' => Payment::where('status', 'pending')->count(),
      'completed' => Payment::where('status', 'completed')->count(),
      'failed' => Payment::where('status', 'failed')->count(),
      'total_amount' => Payment::where('status', 'completed')->sum('amount'),
    ];
  }
}
