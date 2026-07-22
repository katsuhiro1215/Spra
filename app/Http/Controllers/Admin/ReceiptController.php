<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Models\Company;
use App\Services\ReceiptService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
  public function __construct(
    private ReceiptService $service
  ) {}

  /**
   * 領収書一覧
   */
  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'status', 'user_id', 'company_id', 'invoice_id']);
    $perPage = $request->input('per_page', 20);

    $query = Receipt::with(['user', 'company', 'invoice', 'payment'])
      ->orderBy('issued_at', 'desc');

    // 検索フィルター
    if (!empty($filters['search'])) {
      $query->where(function ($q) use ($filters) {
        $q->where('receipt_number', 'like', "%{$filters['search']}%");
      });
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (!empty($filters['user_id'])) {
      $query->where('user_id', $filters['user_id']);
    }

    if (!empty($filters['company_id'])) {
      $query->where('company_id', $filters['company_id']);
    }

    if (!empty($filters['invoice_id'])) {
      $query->where('invoice_id', $filters['invoice_id']);
    }

    $receipts = $query->paginate($perPage);

    $stats = [
      'total' => Receipt::count(),
      'draft' => Receipt::where('status', 'draft')->count(),
      'issued' => Receipt::where('status', 'issued')->count(),
      'sent' => Receipt::where('status', 'sent')->count(),
      'total_amount' => Receipt::where('status', '!=', 'draft')->sum('total_amount'),
    ];

    return Inertia::render('Admin/Receipts/Index', [
      'receipts' => $receipts,
      'filters'  => $filters,
      'stats'    => $stats,
      'statuses' => Receipt::STATUSES,
    ]);
  }

  /**
   * 領収書詳細
   */
  public function show(string $id): Response
  {
    $receipt = Receipt::with([
      'user.profile',
      'company.addresses',
      'invoice.items',
      'payment',
      'createdBy'
    ])->findOrFail($id);

    return Inertia::render('Admin/Receipts/Show', [
      'receipt' => $receipt,
    ]);
  }

  /**
   * 領収書作成フォーム
   */
  public function create(Request $request): Response
  {
    $invoice = null;
    $payment = null;

    // invoice_idパラメータがある場合、請求書情報を取得
    if ($request->has('invoice_id')) {
      $invoice = Invoice::with(['user', 'company', 'items'])->find($request->invoice_id);
    }

    // payment_idパラメータがある場合、決済情報を取得
    if ($request->has('payment_id')) {
      $payment = Payment::with(['invoice'])->find($request->payment_id);
      if ($payment && !$invoice) {
        $invoice = $payment->invoice;
      }
    }

    return Inertia::render('Admin/Receipts/Create', [
      'invoices'  => Invoice::where('status', 'paid')->orderBy('created_at', 'desc')->get(['id', 'invoice_number', 'user_id', 'company_id', 'total_amount', 'status', 'invoice_type']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::with('users.profile')->orderBy('name')->get(['id', 'name']),
      'statuses'  => Receipt::STATUSES,
      'invoice'   => $invoice,
      'payment'   => $payment,
    ]);
  }

  /**
   * 領収書作成
   */
  public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'invoice_id'    => 'required|ulid|exists:invoices,id',
      'payment_id'    => 'nullable|ulid|exists:payments,id',
      'user_id'       => 'required|uuid|exists:users,id',
      'company_id'    => 'nullable|ulid|exists:companies,id',
      'amount'        => 'required|numeric|min:0',
      'tax_amount'    => 'required|numeric|min:0',
      'total_amount'  => 'required|numeric|min:0',
      'status'        => 'required|string|in:draft,issued,sent',
      'issued_at'     => 'nullable|date',
      'notes'         => 'nullable|string',
    ]);

    // Invoiceを取得
    $invoice = Invoice::findOrFail($validated['invoice_id']);

    // 領収書番号を生成
    $receiptNumber = $this->generateReceiptNumber();
    $validated['receipt_number'] = $receiptNumber;
    $validated['created_by'] = auth()->guard('admins')->id();

    if ($validated['status'] === 'issued' && !$validated['issued_at']) {
      $validated['issued_at'] = now();
    }

    $receipt = Receipt::create($validated);

    // ステータスが「送付済み」で作成された場合、PDF生成に加えて実際にメール送信も行う
    // (以前は生成のみでステータスだけ「送付済み」になり、実際には送られていなかった)
    if ($receipt->status === 'sent') {
      $this->service->sendReceipt($receipt);
    } elseif ($receipt->status === 'issued') {
      $this->service->generateAndSavePdf($receipt);
    }

    return redirect()->route('admin.receipt.show', $receipt->id)
      ->with('success', __('messages.created', ['attribute' => '領収書']));
  }

  /**
   * 領収書編集フォーム
   */
  public function edit(string $id): Response|RedirectResponse
  {
    $receipt = Receipt::with(['user', 'company', 'invoice'])->findOrFail($id);

    // 送付済みの領収書は編集不可
    if ($receipt->status === 'sent') {
      return redirect()->route('admin.receipt.show', $receipt->id)
        ->with('error', __('messages.receipt.delivered_cannot_edit'));
    }

    return Inertia::render('Admin/Receipts/Edit', [
      'receipt'   => $receipt,
      'invoices'  => Invoice::where('status', 'paid')->orderBy('created_at', 'desc')->get(['id', 'invoice_number', 'user_id', 'company_id', 'total_amount', 'status', 'invoice_type']),
      'users'     => User::with('profile')->orderBy('email')->get(['id', 'email']),
      'companies' => Company::with('users.profile')->orderBy('name')->get(['id', 'name']),
      'statuses'  => Receipt::STATUSES,
    ]);
  }

  /**
   * 領収書更新
   */
  public function update(Request $request, string $id): RedirectResponse
  {
    $receipt = Receipt::findOrFail($id);

    // 送付済みの領収書は編集不可
    if ($receipt->status === 'sent') {
      return back()->with('error', __('messages.receipt.delivered_cannot_edit'));
    }

    $validated = $request->validate([
      'invoice_id'    => 'required|ulid|exists:invoices,id',
      'payment_id'    => 'nullable|ulid|exists:payments,id',
      'user_id'       => 'required|uuid|exists:users,id',
      'company_id'    => 'nullable|ulid|exists:companies,id',
      'amount'        => 'required|numeric|min:0',
      'tax_amount'    => 'required|numeric|min:0',
      'total_amount'  => 'required|numeric|min:0',
      'status'        => 'required|string|in:draft,issued,sent',
      'issued_at'     => 'nullable|date',
      'notes'         => 'nullable|string',
    ]);

    if ($validated['status'] === 'issued' && !$validated['issued_at']) {
      $validated['issued_at'] = now();
    }

    $wasSent = $receipt->status === 'sent';

    $receipt->update($validated);

    // ステータスが新たに「送付済み」になった場合は実際にメール送信も行う
    if ($receipt->status === 'sent' && !$wasSent) {
      $this->service->sendReceipt($receipt);
    } elseif (in_array($receipt->status, ['issued', 'sent']) && !$receipt->pdf_path) {
      $this->service->generateAndSavePdf($receipt);
    }

    return redirect()->route('admin.receipt.show', $receipt->id)
      ->with('success', __('messages.updated', ['attribute' => '領収書']));
  }

  /**
   * 領収書削除
   */
  public function destroy(string $id): RedirectResponse
  {
    $receipt = Receipt::findOrFail($id);

    // 送付済みの領収書は削除不可
    if ($receipt->status === 'sent') {
      return back()->with('error', __('messages.receipt.delivered_cannot_delete'));
    }

    // PDFファイルも削除
    if ($receipt->pdf_path) {
      Storage::disk('private')->delete($receipt->pdf_path);
    }

    $receipt->delete();

    return redirect()->route('admin.receipt.index')
      ->with('success', __('messages.deleted', ['attribute' => '領収書']));
  }

  /**
   * 領収書PDFダウンロード（管理者用）
   */
  public function download(string $id): HttpResponse
  {
    $receipt = Receipt::with(['user', 'company', 'invoice'])->findOrFail($id);

    // PDFが存在しない場合は生成
    if (!$receipt->pdf_path) {
      $this->service->generateAndSavePdf($receipt);
      $receipt->refresh();
    }

    $pdf = Storage::disk('private')->get($receipt->pdf_path);
    $filename = "receipt_{$receipt->receipt_number}.pdf";

    return response($pdf, 200, [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => "attachment; filename=\"{$filename}\"",
    ]);
  }

  /**
   * 領収書送付
   */
  public function send(string $id): RedirectResponse
  {
    $receipt = Receipt::findOrFail($id);

    if ($receipt->status === 'sent') {
      return back()->with('error', __('messages.receipt.already_delivered'));
    }

    try {
      $this->service->sendReceipt($receipt);

      return back()->with('success', __('messages.delivered', ['attribute' => '領収書']));
    } catch (\Exception $e) {
      return back()->with('error', __('messages.action_failed_detail', ['attribute' => '領収書の送付', 'message' => $e->getMessage()]));
    }
  }

  /**
   * 領収書番号生成
   */
  private function generateReceiptNumber(): string
  {
    $year = date('Y');
    // withTrashed: 論理削除された領収書の番号も含めて重複を避ける
    // (receipt_number にはユニーク制約があるため、除外すると採番が衝突しうる)
    $lastReceipt = Receipt::withTrashed()
      ->whereYear('created_at', $year)
      ->orderBy('receipt_number', 'desc')
      ->first();

    if ($lastReceipt && preg_match('/RCP(\d{4})-(\d+)/', $lastReceipt->receipt_number, $matches)) {
      $nextNumber = intval($matches[2]) + 1;
    } else {
      $nextNumber = 1;
    }

    return sprintf('RCP%s-%04d', $year, $nextNumber);
  }
}
