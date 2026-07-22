<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Payment;
use App\Models\Receipt;
use Illuminate\Database\Seeder;

class ReceiptSeeder extends Seeder
{
    /**
     * 入金済みの請求書に対する領収書を発行する。
     */
    public function run(): void
    {
        $payments = Payment::where('status', 'completed')->with('invoice')->get();
        $admin = Admin::first();

        if ($payments->isEmpty() || !$admin) {
            $this->command?->warn('ReceiptSeeder: 前提データ（入金記録/Admin）が不足しているためスキップします。');
            return;
        }

        $counter = 1;
        $created = 0;

        foreach ($payments as $payment) {
            $invoice = $payment->invoice;
            if (!$invoice) {
                continue;
            }

            $issuedAt = $payment->payment_date->copy()->addDay();

            $receipt = Receipt::create([
                'receipt_number' => 'RCT' . $issuedAt->format('Y') . '-' . str_pad($counter++, 4, '0', STR_PAD_LEFT),
                'invoice_id' => $invoice->id,
                'payment_id' => $payment->id,
                'user_id' => $invoice->user_id,
                'company_id' => $invoice->company_id,
                'amount' => $invoice->subtotal,
                'tax_amount' => $invoice->tax_amount,
                'total_amount' => $invoice->total_amount,
                'status' => 'issued',
                'issued_at' => $issuedAt,
                'created_by' => $admin->id,
            ]);
            $receipt->forceFill(['created_at' => $issuedAt, 'updated_at' => $issuedAt])->save();

            $created++;
        }

        $this->command?->info("ReceiptSeeder: {$created}件の領収書を作成しました。");
    }
}
