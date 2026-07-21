<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Repositories\InvoiceRepository;
use App\Repositories\PaymentRepository;
use App\Mail\InvoiceMail;
use App\Mail\InvoiceReminderMail;
use App\Support\PdfFontRegistrar;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function create(array $data): Invoice
    {
        return $this->invoiceRepository->create($data);
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        return $this->invoiceRepository->update($invoice, $data);
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

    public function getUnpaidByUser(string $userId): Collection
    {
        return $this->invoiceRepository->getUnpaidByUser($userId);
    }

    public function getOverdueInvoices(): Collection
    {
        return $this->invoiceRepository->getOverdueInvoices();
    }

    /**
     * 月額契約から請求書を自動生成
     */
    public function generateMonthlyInvoice(Contract $contract): Invoice
    {
        return DB::transaction(function () use ($contract) {
            $contract->loadMissing('currentVersion.items');
            $currentVersion = $contract->currentVersion;

            if (!$currentVersion) {
                throw new \Exception('契約に有効なバージョンがありません。');
            }

            // 請求日と支払期限を計算
            $issueDate = now();
            $dueDate = now()->addDays($contract->payment_due_days ?? 15);

            // 金額は契約の現行バージョンから取得(Contract自体にamount/tax_rateは存在しない)
            $subtotal = (float) ($currentVersion->total_amount ?? 0);
            $taxRate = (float) ($currentVersion->tax_rate ?? 0);
            $taxAmount = round($subtotal * $taxRate / 100, 2);
            $totalAmount = $subtotal + $taxAmount;

            // 請求書作成
            $invoice = $this->invoiceRepository->create([
                'invoice_number' => $this->generateInvoiceNumber(),
                'invoice_type' => 'monthly',
                'contract_id' => $contract->id,
                'user_id' => $contract->billing_user_id ?? $contract->user_id,
                'company_id' => $contract->company_id,
                'issue_date' => $issueDate,
                'due_date' => $dueDate,
                'billing_period_start' => $issueDate->copy()->startOfMonth(),
                'billing_period_end' => $issueDate->copy()->endOfMonth(),
                'subtotal' => $subtotal,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'draft',
                'created_by' => null,
            ]);

            $this->snapshotItemsFromContract($invoice, $currentVersion);

            // 契約の次回請求日と最終請求日を更新
            // calculateNextBillingDate() は last_invoiced_at を基準に計算するため、
            // 先にメモリ上で last_invoiced_at を確定させてから計算する(でないと更新前の古い値が使われる)
            $contract->last_invoiced_at = now();
            $nextBillingDate = $contract->calculateNextBillingDate();
            $contract->update([
                'last_invoiced_at' => $contract->last_invoiced_at,
                'next_billing_date' => $nextBillingDate,
            ]);

            // バッチ生成→自動送信まで一気通貫にする
            \App\Jobs\SendInvoiceJob::dispatch($invoice);

            return $invoice;
        });
    }

    /**
     * ContractVersionの明細(ContractItem)をInvoiceItemとしてスナップショットする
     */
    public function snapshotItemsFromContract(Invoice $invoice, ContractVersion $contractVersion): void
    {
        foreach ($contractVersion->items as $sortOrder => $contractItem) {
            $invoice->items()->create([
                'description' => $contractItem->name . ($contractItem->description ? '（' . $contractItem->description . '）' : ''),
                'quantity' => $contractItem->quantity,
                'unit_price' => $contractItem->unit_price,
                'amount' => $contractItem->amount,
                'sort_order' => $sortOrder,
            ]);
        }
    }

    /**
     * 請求書のPDFを生成して保存
     */
    public function generateAndSavePdf(Invoice $invoice): string
    {
        // PDF生成
        $pdf = Pdf::loadView('pdfs.invoice', [
            'invoice' => $invoice->load(['user', 'company', 'contract', 'items']),
            'status_label' => Invoice::STATUSES[$invoice->status] ?? $invoice->status,
        ]);
        PdfFontRegistrar::registerDomPdf($pdf);

        // 保存パス生成
        $directory = "invoices/{$invoice->user_id}";
        $filename = "invoice_{$invoice->invoice_number}_" . now()->format('YmdHis') . ".pdf";
        $path = "{$directory}/{$filename}";

        // プライベートディスクに保存
        Storage::disk('private')->put($path, $pdf->output());

        // Invoiceモデルのpdf_pathを更新
        $invoice->update(['pdf_path' => $path]);

        return $path;
    }

    /**
     * 請求書を送付
     */
    public function sendInvoice(Invoice $invoice): bool
    {
        return DB::transaction(function () use ($invoice) {
            // PDFがまだ生成されていなければ生成
            if (!$invoice->pdf_path) {
                $this->generateAndSavePdf($invoice);
                $invoice->refresh();
            }

            // メール送信
            Mail::to($invoice->user->email)->send(new InvoiceMail($invoice));

            // ステータスを送付済みに更新
            $this->invoiceRepository->update($invoice, [
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return true;
        });
    }

    /**
     * 請求書を再送
     */
    public function resendInvoice(Invoice $invoice): bool
    {
        return DB::transaction(function () use ($invoice) {
            // メール再送信
            Mail::to($invoice->user->email)->send(new InvoiceReminderMail($invoice));

            // 再送カウントと最終再送日時を更新
            $this->invoiceRepository->update($invoice, [
                'resend_count' => $invoice->resend_count + 1,
                'last_resent_at' => now(),
            ]);

            return true;
        });
    }

    /**
     * 請求書番号を生成
     */
    public function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $lastInvoice = Invoice::whereYear('created_at', $year)
            ->orderBy('invoice_number', 'desc')
            ->first();

        if ($lastInvoice && preg_match('/INV(\d{4})-(\d+)/', $lastInvoice->invoice_number, $matches)) {
            $nextNumber = intval($matches[2]) + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('INV%s-%04d', $year, $nextNumber);
    }
}
