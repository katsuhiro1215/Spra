<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use App\Models\Company;
use App\Models\Invoice;
use App\Services\InvoiceService;
use App\Services\PaymentService;
use App\Services\ReceiptService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
  public function __construct(
    private InvoiceService $service,
    private PaymentService $paymentService,
    private ReceiptService $receiptService
  ) {}

  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'status', 'user_id', 'company_id']);

    $invoices = $this->service->getPaginated($filters, 20);

    $stats = [
      'total' => Invoice::count(),
      'draft' => Invoice::where('status', 'draft')->count(),
      'sent' => Invoice::where('status', 'sent')->count(),
      'paid' => Invoice::where('status', 'paid')->count(),
      'overdue' => Invoice::where('status', 'overdue')->count(),
      'total_amount' => Invoice::whereIn('status', ['sent', 'viewed', 'overdue'])->sum('total_amount'),
      'paid_amount' => Invoice::where('status', 'paid')->sum('total_amount'),
    ];

    return Inertia::render('Admin/Invoices/Index', [
      'invoices' => $invoices,
      'filters'  => $filters,
      'stats'    => $stats,
      'statuses' => Invoice::STATUSES,
    ]);
  }

  public function show(string $id): Response
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    $payments = $this->paymentService->getByInvoiceId($invoice->id);

    return Inertia::render('Admin/Invoices/Show', [
      'invoice' => $invoice,
      'payments' => $payments,
    ]);
  }

  public function create(Request $request): Response
  {
    $company = null;
    $user = null;
    $contract = null;

    // company_idパラメータがある場合、会社情報を取得
    if ($request->has('company_id')) {
      $company = Company::with(['addresses', 'users'])->find($request->company_id);
    }

    // user_idパラメータがある場合、ユーザー情報を取得
    if ($request->has('user_id')) {
      $user = User::with(['profile', 'companies'])->find($request->user_id);
    }

    // contract_idパラメータがある場合、契約情報を取得
    if ($request->has('contract_id')) {
      $contract = Contract::with(['user', 'company'])->find($request->contract_id);
    }

    return Inertia::render('Admin/Invoices/Create', [
      'contracts' => Contract::where('status', 'active')->orderBy('created_at', 'desc')->get(['id', 'contract_number', 'title', 'user_id', 'company_id']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::orderBy('name')->get(['id', 'name']),
      'statuses'  => Invoice::STATUSES,
      'company'   => $company,
      'user'      => $user,
      'contract'  => $contract,
    ]);
  }

  public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'contract_id'           => 'nullable|ulid|exists:contracts,id',
      'user_id'               => 'nullable|uuid|exists:users,id',
      'company_id'            => 'nullable|ulid|exists:companies,id',
      'title'                 => 'required|string|max:255',
      'status'                => 'required|string|in:draft,sent,paid,overdue,cancelled',
      'due_date'              => 'nullable|date',
      'billing_period_start'  => 'nullable|date',
      'billing_period_end'    => 'nullable|date|after_or_equal:billing_period_start',
      'tax_rate'              => 'required|numeric|min:0|max:100',
      'notes'                 => 'nullable|string',
      'items'                 => 'array',
      'items.*.name'          => 'required|string|max:255',
      'items.*.description'   => 'nullable|string',
      'items.*.quantity'      => 'required|integer|min:1',
      'items.*.unit_price'    => 'required|integer|min:0',
    ]);

    $items = $validated['items'] ?? [];
    unset($validated['items']);

    // 明細から合計金額を算出
    $subtotal = collect($items)->sum(fn($item) => $item['quantity'] * $item['unit_price']);
    $taxAmount = (int) round($subtotal * ($validated['tax_rate'] / 100));
    $validated['subtotal'] = $subtotal;
    $validated['tax_amount'] = $taxAmount;
    $validated['total_amount'] = $subtotal + $taxAmount;

    // 明細にamountをセット
    $items = array_map(function ($item) {
      $item['amount'] = $item['quantity'] * $item['unit_price'];
      return $item;
    }, $items);

    // Generate invoice number
    $latestInvoice = Invoice::latest('id')->first();
    $nextNumber = $latestInvoice ? ((int)substr($latestInvoice->invoice_number, -6)) + 1 : 1;
    $validated['invoice_number'] = 'INV-' . date('Ym') . '-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

    $invoice = $this->service->create($validated, $items);

    return redirect()->route('admin.invoice.show', $invoice->id)
      ->with('success', '請求書を作成しました。');
  }

  public function edit(string $id): Response|RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    // 送付済みまたは支払い済みの請求書は編集不可
    if (in_array($invoice->status, ['sent', 'viewed', 'paid', 'overdue'])) {
      return redirect()->route('admin.invoice.show', $invoice->id)
        ->with('error', 'この請求書は編集できません。');
    }

    return Inertia::render('Admin/Invoices/Edit', [
      'invoice'   => $invoice,
      'contracts' => Contract::where('status', 'active')->orderBy('created_at', 'desc')->get(['id', 'contract_number', 'title', 'user_id', 'company_id']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::orderBy('name')->get(['id', 'name']),
      'statuses'  => Invoice::STATUSES,
    ]);
  }

  public function update(Request $request, string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    // 送付済みまたは支払い済みの請求書は更新不可
    if (in_array($invoice->status, ['sent', 'viewed', 'paid', 'overdue'])) {
      return redirect()->route('admin.invoice.show', $invoice->id)
        ->with('error', 'この請求書は編集できません。');
    }

    $validated = $request->validate([
      'contract_id'           => 'nullable|ulid|exists:contracts,id',
      'user_id'               => 'nullable|uuid|exists:users,id',
      'company_id'            => 'nullable|ulid|exists:companies,id',
      'title'                 => 'required|string|max:255',
      'status'                => 'required|string|in:draft,sent,paid,overdue,cancelled',
      'due_date'              => 'nullable|date',
      'billing_period_start'  => 'nullable|date',
      'billing_period_end'    => 'nullable|date|after_or_equal:billing_period_start',
      'tax_rate'              => 'required|numeric|min:0|max:100',
      'notes'                 => 'nullable|string',
      'items'                 => 'array',
      'items.*.name'          => 'required|string|max:255',
      'items.*.description'   => 'nullable|string',
      'items.*.quantity'      => 'required|integer|min:1',
      'items.*.unit_price'    => 'required|integer|min:0',
    ]);

    $items = $validated['items'] ?? [];
    unset($validated['items']);

    if (!empty($items)) {
      $subtotal = collect($items)->sum(fn($item) => $item['quantity'] * $item['unit_price']);
      $taxAmount = (int) round($subtotal * ($validated['tax_rate'] / 100));
      $validated['subtotal'] = $subtotal;
      $validated['tax_amount'] = $taxAmount;
      $validated['total_amount'] = $subtotal + $taxAmount;

      $items = array_map(function ($item) {
        $item['amount'] = $item['quantity'] * $item['unit_price'];
        return $item;
      }, $items);
    }

    $this->service->update($invoice, $validated, $items);

    return redirect()->route('admin.invoice.show', $invoice->id)
      ->with('success', '請求書を更新しました。');
  }

  public function destroy(string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    // 下書き以外は削除不可
    if ($invoice->status !== 'draft') {
      return redirect()->route('admin.invoice.index')
        ->with('error', '下書きの請求書のみ削除できます。');
    }

    $invoice->delete();

    return redirect()->route('admin.invoice.index')
      ->with('success', '請求書を削除しました。');
  }

  public function send(string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    $this->service->markAsSent($invoice);

    return back()->with('success', '請求書を送付済みにしました。');
  }

  public function recordPayment(Request $request, string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    $validated = $request->validate([
      'amount'            => 'required|numeric|min:0',
      'payment_method'    => 'required|string|in:bank_transfer,credit_card,cash,other',
      'payment_date'      => 'required|date',
      'payment_type'      => 'nullable|string|in:deposit,interim,final,full',
      'transaction_id'    => 'nullable|string|max:255',
      'notes'             => 'nullable|string',
    ]);

    $this->paymentService->create(array_merge($validated, [
      'invoice_id' => $invoice->id,
      'status' => 'completed',
      'confirmed_by' => auth('admins')->id(),
    ]));

    return back()->with('success', '入金を記録しました。');
  }

  public function downloadPdf(string $id)
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    $pdf = Pdf::loadView('pdfs.invoice', compact('invoice'))
      ->setPaper('A4', 'portrait');

    $filename = sprintf('請求書_%s_%s.pdf', $invoice->invoice_number, date('Ymd'));

    return $pdf->download($filename);
  }

  public function previewPdf(string $id)
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    $pdf = Pdf::loadView('pdfs.invoice', compact('invoice'))
      ->setPaper('A4', 'portrait');

    return $pdf->stream();
  }

  public function overdueList(): Response
  {
    $invoices = $this->service->getOverdueInvoices();

    return Inertia::render('Admin/Invoices/Overdue', [
      'invoices' => $invoices,
    ]);
  }

  /**
   * 入金確認して領収書を発行
   */
  public function confirmPayment(string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    // すでに支払い済みの場合はエラー
    if ($invoice->status === 'paid') {
      return back()->with('error', 'この請求書はすでに支払い済みです。');
    }

    try {
      DB::transaction(function () use ($invoice) {
        // 請求書のステータスを支払い済みに更新
        $invoice->update([
          'status' => 'paid',
          'paid_at' => now(),
        ]);

        // 領収書を発行（自動的にPDF生成・保存）
        $receipt = $this->receiptService->issueReceipt($invoice);

        // 領収書のPDFを生成
        $this->receiptService->generateAndSavePdf($receipt);

        // 領収書を発行済みに更新して送信
        $receipt->update(['status' => 'issued']);
        $this->receiptService->sendReceipt($receipt);
      });

      return back()->with('success', '入金を確認し、領収書を発行・送信しました。');
    } catch (\Exception $e) {
      return back()->with('error', '入金確認処理に失敗しました: ' . $e->getMessage());
    }
  }

  /**
   * 請求書を再送信
   */
  public function resend(string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    // 下書きまたは支払い済みの請求書は再送不可
    if ($invoice->status === 'draft') {
      return back()->with('error', '下書きの請求書は再送信できません。');
    }

    if ($invoice->status === 'paid') {
      return back()->with('error', 'すでに支払い済みの請求書は再送信できません。');
    }

    try {
      $this->service->resendInvoice($invoice);
      return back()->with('success', '請求書を再送信しました。');
    } catch (\Exception $e) {
      return back()->with('error', '請求書の再送信に失敗しました: ' . $e->getMessage());
    }
  }
}
