<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 入金台帳（全請求書横断の閲覧用）
 *
 * 個々の入金の記録・確認は各請求書の詳細画面（Admin\Invoice\InvoiceController）から行う。
 * ここでは横断的な一覧・詳細の閲覧のみを提供する。
 */
class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $service
    ) {}

    /**
     * 支払い一覧表示
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'payment_method']);
        $payments = $this->service->getPaginated($filters, 20);
        $stats = $this->service->getStats();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $filters,
            'stats' => $stats,
            'statuses' => Payment::STATUSES,
            'methods' => Payment::METHODS,
        ]);
    }

    /**
     * 支払い作成フォーム表示
     * 入金の記録は請求書詳細画面から行うため、そちらへ誘導する
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('admin.invoice.index')
            ->with('info', '入金の記録は各請求書の詳細画面から行ってください。');
    }

    /**
     * 支払い保存（未使用。createと同様に請求書詳細画面へ誘導）
     */
    public function store(PaymentRequest $request): RedirectResponse
    {
        return redirect()->route('admin.invoice.index');
    }

    /**
     * 支払い詳細表示
     */
    public function show(Payment $payment): Response
    {
        $payment->load(['invoice.contract', 'invoice.user.profile', 'company', 'confirmedBy.profile']);

        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment,
        ]);
    }

    /**
     * 支払い編集フォーム表示
     * 金額の訂正が必要な場合は請求書詳細画面から行う
     */
    public function edit(Payment $payment): RedirectResponse
    {
        return redirect()->route('admin.invoice.show', $payment->invoice_id)
            ->with('info', '入金内容の修正は請求書詳細画面から行ってください。');
    }

    /**
     * 支払い更新（未使用）
     */
    public function update(PaymentRequest $request, Payment $payment): RedirectResponse
    {
        return redirect()->route('admin.invoice.show', $payment->invoice_id);
    }

    /**
     * 支払い削除
     */
    public function destroy(Payment $payment): RedirectResponse
    {
        $invoiceId = $payment->invoice_id;
        $this->service->delete($payment);

        return redirect()->route('admin.invoice.show', $invoiceId)
            ->with('success', '入金記録を削除しました。');
    }
}
