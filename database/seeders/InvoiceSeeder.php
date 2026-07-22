<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * 有効・完了済みの契約から請求書を作成する。
     * 期限超過（支払期限切れ・未払い）を含む様々なステータスで、
     * ダッシュボードの対応キュー・売上KPIを確認できるようにする。
     */
    public function run(): void
    {
        $contracts = Contract::whereIn('status', ['active', 'completed'])
            ->with('currentVersion')
            ->orderBy('start_date')
            ->get();
        $admin = Admin::first();

        if ($contracts->isEmpty() || !$admin) {
            $this->command?->warn('InvoiceSeeder: 前提データ（有効な契約/Admin）が不足しているためスキップします。');
            return;
        }

        $now = Carbon::now();
        $counter = 1;
        $created = 0;

        foreach ($contracts as $contract) {
            $version = $contract->currentVersion;
            if (!$version) {
                continue;
            }

            $issueDate = Carbon::parse($contract->start_date)->addDays(3);
            $dueDays = $contract->payment_due_days ?: 15;
            $dueDate = $issueDate->copy()->addDays($dueDays);

            $created += $this->createInvoice($contract, $version->total_amount, $version->tax_rate, $issueDate, $dueDate, $admin, $counter, $now, 'full');
        }

        $this->command?->info("InvoiceSeeder: {$created}件の請求書を作成しました。");
    }

    private function createInvoice(
        Contract $contract,
        float $totalAmount,
        float $taxRate,
        Carbon $issueDate,
        Carbon $dueDate,
        Admin $admin,
        int &$counter,
        Carbon $now,
        string $invoiceType
    ): int {
        $taxAmount = round($totalAmount * $taxRate / (100 + $taxRate), 2);
        $subtotal = $totalAmount - $taxAmount;

        if ($dueDate->isPast()) {
            $bucket = fake()->randomElement(['paid', 'paid', 'paid', 'overdue', 'sent_overdue']);
        } else {
            $bucket = fake()->randomElement(['draft', 'sent', 'sent']);
        }

        [$status, $sentAt, $viewedAt, $paidAt] = match ($bucket) {
            'paid' => ['paid', $issueDate->copy()->addDay(), $issueDate->copy()->addDays(2), $dueDate->copy()->subDays(fake()->numberBetween(0, 7))],
            'overdue' => ['overdue', $issueDate->copy()->addDay(), $issueDate->copy()->addDays(2), null],
            'sent_overdue' => ['sent', $issueDate->copy()->addDay(), null, null],
            'sent' => ['sent', $issueDate->copy()->addDay(), null, null],
            default => ['draft', null, null, null],
        };

        $invoiceNumber = 'INV' . $issueDate->format('Y') . '-' . str_pad($counter++, 4, '0', STR_PAD_LEFT);

        $invoice = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'invoice_type' => $invoiceType,
            'issue_date' => $issueDate->toDateString(),
            'contract_id' => $contract->id,
            'user_id' => $contract->user_id,
            'company_id' => $contract->company_id,
            'subtotal' => $subtotal,
            'discount_amount' => 0,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'status' => $status,
            'due_date' => $dueDate->toDateString(),
            'sent_at' => $sentAt,
            'viewed_at' => $viewedAt,
            'paid_at' => $paidAt,
            'created_by' => $admin->id,
        ]);
        $invoice->forceFill(['created_at' => $issueDate, 'updated_at' => $now])->save();

        return 1;
    }
}
