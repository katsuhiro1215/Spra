<?php

namespace App\Repositories;

use App\Models\Payment;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentRepository implements PaymentRepositoryInterface
{
  public function query(): Builder
  {
    return Payment::query();
  }

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
  {
    return $this->findWithFilters($filters)
      ->with(['invoice.user.profile'])
      ->latest('payment_date')
      ->paginate($perPage)
      ->withQueryString();
  }

  public function findById(string $id): ?Payment
  {
    return Payment::with(['invoice', 'confirmedBy'])->find($id);
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = Payment::query()->with(['invoice']);

    if (!empty($filters['invoice_id'])) {
      $query->where('invoice_id', $filters['invoice_id']);
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (!empty($filters['payment_method'])) {
      $query->where('payment_method', $filters['payment_method']);
    }

    return $query;
  }

  public function create(array $data): Payment
  {
    return Payment::create($data);
  }

  public function update(Payment $payment, array $data): Payment
  {
    $payment->update($data);
    return $payment->fresh();
  }

  public function confirm(Payment $payment, string $confirmedByAdminId): Payment
  {
    $payment->update([
      'status' => 'completed',
      'confirmed_by' => $confirmedByAdminId,
      'confirmed_at' => now(),
    ]);
    return $payment->fresh();
  }
}
