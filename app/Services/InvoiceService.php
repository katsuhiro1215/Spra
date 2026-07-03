<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Contract;
use App\Repositories\InvoiceRepository;
use App\Repositories\PaymentRepository;
use App\Mail\InvoiceMail;
use App\Mail\InvoiceReminderMail;
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

  /**
   * 月額契約から請求書を自動生成
   */
  public function generateMonthlyInvoice(Contract $contract): Invoice
  {
    return DB::transaction(function () use ($contract) {
      // 請求書番号を生成
      $invoiceNumber = $this->generateInvoiceNumber();

      // 請求日と支払期限を計算
      $issueDate = now();
      $dueDate = now()->addDays($contract->payment_due_days);

      // 税額計算
      $amount = $contract->amount;
      $taxAmount = $amount * ($contract->tax_rate / 100);
      $totalAmount = $amount + $taxAmount;

      // 請求書作成
      $invoice = $this->invoiceRepository->create([
        'invoice_number' => $invoiceNumber,
        'contract_id' => $contract->id,
        'user_id' => $contract->user_id,
        'company_id' => $contract->company_id,
        'title' => $contract->title . ' - ' . now()->format('Y年m月分'),
        'description' => 'Webサイト管理費（月額）',
        'issue_date' => $issueDate,
        'due_date' => $dueDate,
        'amount' => $amount,
        'tax_rate' => $contract->tax_rate,
        'tax_amount' => $taxAmount,
        'total_amount' => $totalAmount,
        'status' => 'draft',
        'created_by' => 'system',
      ]);

      // 請求書明細を作成
      $invoice->items()->create([
        'description' => 'Webサイト管理費（' . now()->format('Y年m月分') . '）',
        'quantity' => 1,
        'unit_price' => $amount,
        'amount' => $amount,
      ]);

      // 契約の次回請求日と最終請求日を更新
      $contract->update([
        'last_invoiced_at' => now(),
        'next_billing_date' => $contract->calculateNextBillingDate(),
      ]);

      return $invoice->load('items');
    });
  }

  /**
   * 請求書のPDFを生成して保存
   */
  public function generateAndSavePdf(Invoice $invoice): string
  {
    // PDF生成
    $pdf = Pdf::loadView('pdf.invoice', [
      'invoice' => $invoice->load(['user', 'company', 'contract', 'items']),
    ]);

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
  private function generateInvoiceNumber(): string
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

  /**
   * 契約から請求書を生成
   *
   * @param Contract $contract
   * @return Invoice
   * @throws \Exception
   */
  public function createFromContract(Contract $contract): Invoice
  {
    return DB::transaction(function () use ($contract) {
      // 契約検証
      if (!$contract->amount || !$contract->user_id) {
        throw new \Exception('契約に必要な情報が足りません');
      }

      // テンプレート取得
      $template = \App\Models\InvoiceTemplate::where('is_active', true)->first();
      if (!$template) {
        throw new \Exception('有効な請求書テンプレートが見つかりません');
      }

      // 着手金を計算
      $depositRate = $contract->deposit_rate ?? 50;  // デフォルト50%
      $subtotal = $contract->amount;
      $depositAmount = round($subtotal * ($depositRate / 100), 2);

      // 税金計算
      $taxRate = $contract->tax_rate ?? 10;
      $taxAmount = round($depositAmount * ($taxRate / 100), 2);
      $totalAmount = $depositAmount + $taxAmount;

      // 請求書データを準備
      $invoiceData = [
        'invoice_number' => $this->generateInvoiceNumber(),
        'issue_date' => now()->toDateString(),
        'contract_id' => $contract->id,
        'invoice_template_id' => $template->id,
        'user_id' => $contract->user_id,
        'company_id' => $contract->company_id,
        'billing_period_start' => $contract->start_date,
        'billing_period_end' => $contract->end_date ?? null,
        'subtotal' => $subtotal,
        'discount_amount' => 0,
        'tax_rate' => $taxRate,
        'tax_amount' => $taxAmount,
        'total_amount' => $totalAmount,
        'deposit_rate' => $depositRate,
        'deposit_amount' => $depositAmount,
        'status' => 'draft',
        'due_date' => now()->addDays(15)->toDateString(),
        'notes' => $template->notice_text,
        'created_by' => auth('admins')->id(),
      ];

      // 請求書と明細を作成
      $invoice = $this->invoiceRepository->create($invoiceData);

      // 請求書明細を作成（着手金）
      $invoice->items()->create([
        'name' => $contract->title,
        'description' => '契約代金（着手金 ' . $depositRate . '%）',
        'quantity' => 1,
        'unit_price' => $depositAmount,
        'amount' => $depositAmount,
      ]);

      return $invoice->load('items');
    });
  }
}
