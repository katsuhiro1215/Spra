<?php

namespace App\Repositories\Contracts;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

interface PaymentRepositoryInterface
{
  public function query(): Builder;

  public function findById(string $id): ?Payment;

  public function findWithFilters(array $filters): Builder;

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function create(array $data): Payment;

  public function update(Payment $payment, array $data): Payment;

  public function confirm(Payment $payment, string $confirmedByAdminId): Payment;
}
