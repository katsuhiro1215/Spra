<?php

namespace App\Repositories\Contracts;

use App\Models\Payment;

/**
 * 支払いリポジトリインターフェース
 *
 * BaseRepositoryInterfaceを継承し、Payment固有のメソッドを追加
 * （PaymentはSoftDeletes未使用のためSoftDeletableRepositoryInterfaceは継承しない）
 */
interface PaymentRepositoryInterface extends BaseRepositoryInterface
{
    public function confirm(Payment $payment, string $confirmedByAdminId): Payment;
}
