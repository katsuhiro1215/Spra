<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use App\Notifications\PaymentConfirmed;
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
     * 入金報告(pending)を確認し、確定(completed)にする
     * 請求額に達していれば請求書のステータス更新・領収書の下書き作成までPaymentServiceが行う
     * (領収書の送信は行わない。内容を確認してから領収書詳細画面で送信する)
     */
    public function confirm(Payment $payment): RedirectResponse
    {
        if ($payment->status !== 'pending') {
            return back()->with('error', __('messages.payment.not_awaiting_confirmation'));
        }

        $wasReceiptIssued = (bool) $payment->invoice?->receipt;

        $confirmed = $this->service->confirm($payment, auth('admins')->id());

        $confirmed->invoice?->user?->notify(new PaymentConfirmed($confirmed));

        // 請求額に達した場合、PaymentService::confirm() が領収書を下書きとして作成済み
        // 内容を確認してから送信できるよう、領収書詳細画面へ遷移する
        $invoice = $confirmed->invoice?->fresh('receipt');
        if ($invoice?->receipt && !$wasReceiptIssued) {
            return redirect()
                ->route('admin.receipt.show', $invoice->receipt->id)
                ->with('success', __('messages.invoice.payment_confirmed_receipt_created'));
        }

        return back()->with('success', __('messages.confirmed', ['attribute' => '入金']));
    }

    /**
     * 支払い削除
     */
    public function destroy(Payment $payment): RedirectResponse
    {
        $invoiceId = $payment->invoice_id;
        $this->service->delete($payment);

        return redirect()->route('admin.invoice.show', $invoiceId)
            ->with('success', __('messages.deleted', ['attribute' => '入金記録']));
    }
}
