<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentNotificationRequest;
use App\Models\Invoice;
use App\Services\InvoiceService;
use App\Services\ReceiptService;
use App\Support\PdfFontRegistrar;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;

class InvoiceController extends Controller
{
  public function __construct(
    private InvoiceService $service,
    private ReceiptService $receiptService,
  ) {}

  public function index(Request $request): Response
  {
    $userId = auth('users')->id();
    $filters = $request->only(['status']);

    $invoices = $this->service->getPaginatedForClient($userId, $filters, 15);

    return Inertia::render('User/Invoices/Index', [
      'invoices' => $invoices,
      'filters'  => $filters,
    ]);
  }

  public function show(Invoice $invoice): Response
  {
    $userId = auth('users')->id();

    $invoice = $this->service->findByIdForClient($invoice->id, $userId);
    abort_unless($invoice, 404);

    return Inertia::render('User/Invoices/Show', [
      'invoice' => $invoice,
    ]);
  }

  /**
   * 入金通知を作成
   */
  public function storePaymentNotification(Invoice $invoice, StorePaymentNotificationRequest $request): RedirectResponse
  {
    $userId = auth('users')->id();

    // ユーザーが自分の請求書に対してのみ操作可能
    abort_unless($invoice->user_id === $userId, 403);

    // 支払い通知を作成
    $this->receiptService->createPaymentNotification($invoice, $request->validated());

    return redirect()->route('user.invoice.show', $invoice->id)
      ->with('success', '入金通知を送信しました。管理者の確認をお待ちください。');
  }

  /**
   * 領収書をダウンロード
   */
  public function downloadReceipt(Invoice $invoice): mixed
  {
    $userId = auth('users')->id();
    abort_unless($invoice->user_id === $userId, 403);

    $receipt = $invoice->receipt;
    abort_unless($receipt?->pdf_path, 404);

    return response()->download(
      storage_path('app/' . $receipt->pdf_path),
      $receipt->receipt_number . '.pdf'
    );
  }

  /**
   * 請求書をPDFでダウンロード
   */
  public function downloadPdf(Invoice $invoice): HttpResponse
  {
    $userId = auth('users')->id();
    $invoice = $this->service->findByIdForClient($invoice->id, $userId);
    abort_unless($invoice, 404);

    $status_label = Invoice::STATUSES[$invoice->status] ?? $invoice->status;

    $pdf = Pdf::loadView('pdfs.invoice', compact('invoice', 'status_label'))
      ->setPaper('A4', 'portrait');
    PdfFontRegistrar::registerDomPdf($pdf);

    $filename = sprintf('請求書_%s.pdf', $invoice->invoice_number);

    return $pdf->download($filename);
  }

  /**
   * 請求書PDFをプレビュー用に取得
   */
  public function previewPdf(Invoice $invoice): HttpResponse
  {
    $userId = auth('users')->id();
    $invoice = $this->service->findByIdForClient($invoice->id, $userId);
    abort_unless($invoice, 404);

    $status_label = Invoice::STATUSES[$invoice->status] ?? $invoice->status;

    $pdf = Pdf::loadView('pdfs.invoice', compact('invoice', 'status_label'))
      ->setPaper('A4', 'portrait');
    PdfFontRegistrar::registerDomPdf($pdf);

    return $pdf->stream();
  }
}
