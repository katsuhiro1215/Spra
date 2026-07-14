<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * 支払済みの請求書に対する入金記録を作成する。
     */
    public function run(): void
    {
        $invoices = Invoice::where('status', 'paid')->whereNotNull('paid_at')->get();
        $admin = Admin::first();

        if ($invoices->isEmpty() || !$admin) {
            $this->command?->warn('PaymentSeeder: 前提データ（支払済み請求書/Admin）が不足しているためスキップします。');
            return;
        }

        $created = 0;

        foreach ($invoices as $invoice) {
            $paymentDate = $invoice->paid_at->copy();

            $payment = Payment::create([
                'invoice_id' => $invoice->id,
                'company_id' => $invoice->company_id,
                'amount' => $invoice->total_amount,
                'payment_method' => fake()->randomElement(['bank_transfer', 'bank_transfer', 'credit_card', 'cash']),
                'payment_date' => $paymentDate->toDateString(),
                'transaction_id' => fake()->boolean(60) ? fake()->uuid() : null,
                'status' => 'completed',
                'confirmed_by' => $admin->id,
                'confirmed_at' => $paymentDate,
            ]);
            $payment->forceFill(['created_at' => $paymentDate, 'updated_at' => $paymentDate])->save();

            $created++;
        }

        $this->command?->info("PaymentSeeder: {$created}件の入金記録を作成しました。");
    }
}
