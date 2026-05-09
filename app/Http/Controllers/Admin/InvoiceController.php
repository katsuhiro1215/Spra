<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\User;
use App\Models\Company;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
  public function __construct(
    private InvoiceService $service
  ) {}

  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'status', 'user_id', 'company_id']);

    $invoices = $this->service->getPaginated($filters, 20);

    return Inertia::render('Admin/Invoice/Index', [
      'invoices' => $invoices,
      'filters'  => $filters,
      'statuses' => \App\Models\Invoice::STATUSES,
    ]);
  }

  public function show(string $id): Response
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    return Inertia::render('Admin/Invoice/Show', [
      'invoice' => $invoice,
    ]);
  }

  public function create(): Response
  {
    return Inertia::render('Admin/Invoice/Create', [
      'contracts' => Contract::where('status', 'active')->orderBy('title')->get(['id', 'title']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::orderBy('name')->get(['id', 'name']),
      'statuses'  => \App\Models\Invoice::STATUSES,
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

    $invoice = $this->service->create($validated, $items);

    return redirect()->route('admin.invoices.show', $invoice->id)
      ->with('success', '請求書を作成しました。');
  }

  public function edit(string $id): Response
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

    return Inertia::render('Admin/Invoice/Edit', [
      'invoice'   => $invoice,
      'contracts' => Contract::where('status', 'active')->orderBy('title')->get(['id', 'title']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::orderBy('name')->get(['id', 'name']),
      'statuses'  => \App\Models\Invoice::STATUSES,
    ]);
  }

  public function update(Request $request, string $id): RedirectResponse
  {
    $invoice = $this->service->findById($id);
    abort_unless($invoice, 404);

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

    return redirect()->route('admin.invoices.show', $invoice->id)
      ->with('success', '請求書を更新しました。');
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
      'amount'            => 'required|integer|min:1',
      'payment_method'    => 'required|string|in:bank_transfer,credit_card,cash,other',
      'paid_at'           => 'required|date',
      'transaction_id'    => 'nullable|string|max:255',
      'notes'             => 'nullable|string',
    ]);

    $validated['status'] = 'confirmed';
    $validated['confirmed_by'] = auth('admins')->id();
    $validated['confirmed_at'] = now();

    $this->service->recordPayment($invoice, $validated);

    return back()->with('success', '入金を記録しました。');
  }

  public function overdueList(): Response
  {
    $invoices = $this->service->getOverdueInvoices();

    return Inertia::render('Admin/Invoice/Overdue', [
      'invoices' => $invoices,
    ]);
  }
}
