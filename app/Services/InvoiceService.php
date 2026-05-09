<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Repositories\InvoiceRepository;
use App\Repositories\PaymentRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
  public function __construct(
    private InvoiceRepository $invoiceRepository,
    private PaymentRepository $paymentRepository,
  ) {}

  public function getPaginated(array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    return $this->invoiceRepository->paginate($perPage, $filters);
  }

  public function getPaginatedForClient(string $userId, array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    return $this->invoiceRepository->paginateForClient($userId, $perPage, $filters);
  }

  public function findById(string $id): ?Invoice
  {
    return $this->invoiceRepository->findById($id);
  }

  public function findByIdForClient(string $id, string $userId): ?Invoice
  {
    return $this->invoiceRepository->findByIdForClient($id, $userId);
  }

  public function create(array $data, array $items = []): Invoice
  {
    return DB::transaction(function () use ($data, $items) {
      $invoice = $this->invoiceRepository->create($data);

      foreach ($items as $item) {
        $invoice->items()->create($item);
      }

      return $invoice->load('items');
    });
  }

  public function update(Invoice $invoice, array $data, array $items = []): Invoice
  {
    return DB::transaction(function () use ($invoice, $data, $items) {
      $updated = $this->invoiceRepository->update($invoice, $data);

      if ($items !== []) {
        $updated->items()->delete();
        foreach ($items as $item) {
          $updated->items()->create($item);
        }
      }

      return $updated->load('items');
    });
  }

  /**
   * 請求書を送付済みにする
   */
  public function markAsSent(Invoice $invoice): Invoice
  {
    return $this->invoiceRepository->update($invoice, [
      'status' => 'sent',
      'sent_at' => now(),
    ]);
  }

  /**
   * 支払いを記録する
   */
  public function recordPayment(Invoice $invoice, array $paymentData): Payment
  {
    return DB::transaction(function () use ($invoice, $paymentData) {
      $payment = $this->paymentRepository->create(array_merge(
        $paymentData,
        ['invoice_id' => $invoice->id]
      ));

      // 支払い金額が請求額を満たしているか確認
      $totalPaid = $invoice->payments()->where('status', 'confirmed')->sum('amount');
      if ($totalPaid >= $invoice->total_amount) {
        $this->invoiceRepository->update($invoice, ['status' => 'paid']);
      }

      return $payment;
    });
  }

  public function getUnpaidByUser(string $userId): Collection
  {
    return $this->invoiceRepository->getUnpaidByUser($userId);
  }

  public function getOverdueInvoices(): Collection
  {
    return $this->invoiceRepository->getOverdueInvoices();
  }
}
