<?php

namespace App\Http\Controllers\Admin\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceRequest;
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
            $contract = Contract::with(['user', 'company', 'currentVersion'])->find($request->contract_id);
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

    public function store(InvoiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['invoice_number'] = $this->service->generateInvoiceNumber();

        $invoice = $this->service->create($validated);

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

    public function update(InvoiceRequest $request, string $id): RedirectResponse
    {
        $invoice = $this->service->findById($id);
        abort_unless($invoice, 404);

        // 送付済みまたは支払い済みの請求書は更新不可
        if (in_array($invoice->status, ['sent', 'viewed', 'paid', 'overdue'])) {
            return redirect()->route('admin.invoice.show', $invoice->id)
                ->with('error', 'この請求書は編集できません。');
        }

        $validated = $request->validated();

        $this->service->update($invoice, $validated);

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

        // 必須項目をバリデーション
        $missingFields = [];

        if (!$invoice->billing_period_start || !$invoice->billing_period_end) {
            $missingFields[] = '請求期間';
        }
        if ($invoice->total_amount <= 0) {
            $missingFields[] = '請求額（0より大きい値）';
        }
        if (!$invoice->due_date) {
            $missingFields[] = '支払期限';
        }
        if (!$invoice->user || !$invoice->user->email) {
            $missingFields[] = 'クライアントのメールアドレス';
        }

        if (!empty($missingFields)) {
            $message = '以下の項目が入力されていません: ' . implode(', ', $missingFields);
            return back()->with('error', $message);
        }

        // ステータスチェック
        if ($invoice->status !== 'draft') {
            return back()->with('error', '下書き状態の請求書のみ送付できます。');
        }

        // ステータスは即時更新（メール送信の成否に依存させない）
        $invoice->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        $invoice->user?->notify(new \App\Notifications\InvoiceSent($invoice));

        // メール送信ジョブをディスパッチ（失敗してもステータスには影響しない）
        \App\Jobs\SendInvoiceJob::dispatch($invoice);

        return back()->with('success', '請求書を送付しました。');
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

        $invoice->load('items');
        $status_label = $this->getStatusLabel($invoice->status);

        $pdf = Pdf::loadView('pdfs.invoice', compact('invoice', 'status_label'))
            ->setPaper('A4', 'portrait');
        \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

        $filename = sprintf('請求書_%s_%s.pdf', $invoice->invoice_number, date('Ymd'));

        return $pdf->download($filename);
    }

    public function previewPdf(string $id)
    {
        $invoice = $this->service->findById($id);
        abort_unless($invoice, 404);

        $invoice->load('items');
        $status_label = $this->getStatusLabel($invoice->status);

        $pdf = Pdf::loadView('pdfs.invoice', compact('invoice', 'status_label'))
            ->setPaper('A4', 'portrait');
        \App\Support\PdfFontRegistrar::registerDomPdf($pdf);

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
     * ステータスの日本語ラベルを取得
     */
    private function getStatusLabel(string $status): string
    {
        return match ($status) {
            'draft' => '下書き',
            'sent' => '送付済み',
            'viewed' => '確認済み',
            'paid' => '支払済み',
            'overdue' => '期限超過',
            default => $status,
        };
    }

    /**
     * 入金確認（金額照合なしの手動確定）
     *
     * 現金手渡しなど、ユーザーからの入金通知を経由しないケース向けの手動確定操作。
     * 通常の入金記録(recordPayment)と同様にPaymentレコードを作成するため、
     * 請求額との比較・領収書自動発行は他の経路と同じロジックで行われる。
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
            $this->paymentService->create([
                'invoice_id' => $invoice->id,
                'company_id' => $invoice->company_id,
                'amount' => $invoice->balance,
                'payment_method' => 'other',
                'payment_date' => now()->toDateString(),
                'notes' => '管理者による確認（金額照合なしの手動確定）',
                'status' => 'completed',
                'confirmed_by' => auth('admins')->id(),
                'confirmed_at' => now(),
            ]);

            return back()->with('success', '入金を確認しました。請求額に達したため領収書を発行・送信しました。');
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



    /**
     * 領収書を発行（手動、通常は支払済み時に自動発行される）
     */
    public function issueReceipt(string $id, Request $request): RedirectResponse
    {
        $invoice = $this->service->findById($id);
        abort_unless($invoice, 404);

        try {
            $paymentNotificationId = $request->input('payment_notification_id');
            $payment = null;

            if ($paymentNotificationId) {
                $paymentNotification = $invoice->paymentNotifications()
                    ->where('id', $paymentNotificationId)
                    ->first();
                $payment = $paymentNotification?->payment;
            }

            $receipt = $this->receiptService->issueReceipt($invoice, $payment);

            // 領収書をユーザーに送付
            $this->receiptService->sendReceipt($receipt);

            return redirect()->route('admin.invoice.show', $invoice->id)
                ->with('success', '領収書を発行・送付しました。');
        } catch (\Exception $e) {
            return back()->with('error', '領収書の発行に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * 支払い通知を確認
     * 実際の入金記録(Payment)を作成し、請求額との比較により自動的に支払済み判定・領収書発行を行う
     */
    public function acknowledgePaymentNotification(string $invoiceId, string $notificationId): RedirectResponse
    {
        $invoice = $this->service->findById($invoiceId);
        abort_unless($invoice, 404);

        $notification = $invoice->paymentNotifications()
            ->where('id', $notificationId)
            ->first();

        abort_unless($notification, 404);

        if (!$notification->isPending()) {
            return back()->with('error', 'この通知は既に確認済みです。');
        }

        try {
            DB::transaction(function () use ($invoice, $notification) {
                $adminId = auth('admins')->id();

                $payment = $this->paymentService->create([
                    'invoice_id' => $invoice->id,
                    'company_id' => $invoice->company_id,
                    'amount' => $notification->amount,
                    'payment_method' => $notification->payment_method,
                    'payment_date' => $notification->payment_date,
                    'transaction_id' => $notification->transaction_id,
                    'notes' => $notification->notes,
                    'status' => 'completed',
                    'confirmed_by' => $adminId,
                    'confirmed_at' => now(),
                ]);

                $this->receiptService->acknowledgePaymentNotification($notification, $adminId, $payment->id);
            });

            return back()->with('success', '支払い通知を確認し、入金を記録しました。');
        } catch (\Exception $e) {
            return back()->with('error', '支払い通知の確認に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * 領収書をダウンロード
     */
    public function downloadReceipt(string $id)
    {
        $invoice = $this->service->findById($id);
        abort_unless($invoice, 404);

        $receipt = $invoice->receipt;
        abort_unless($receipt?->pdf_path, 404);

        return response()->download(
            storage_path('app/' . $receipt->pdf_path),
            $receipt->receipt_number . '.pdf'
        );
    }
}
