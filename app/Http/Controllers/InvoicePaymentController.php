<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Invoice;
use App\Notifications\PaymentReported;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 請求書メールのリンクから、ログイン不要で入金を報告するためのコントローラー
 */
class InvoicePaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService,
    ) {}

    /**
     * 入金報告フォームを表示（Public - No Auth）
     */
    public function show(string $token): Response
    {
        $invoice = Invoice::where('payment_report_token', $token)->firstOrFail();

        return Inertia::render('InvoicePaymentForm', [
            'token' => $token,
            'invoice' => [
                'invoice_number' => $invoice->invoice_number,
                'title' => $invoice->contract?->title,
                'due_date' => $invoice->due_date?->format('Y年m月d日'),
                'total_amount' => (float) $invoice->total_amount,
                'balance' => $invoice->balance,
                'status' => $invoice->status,
                'status_name' => $invoice->status_name,
            ],
        ]);
    }

    /**
     * 入金報告を保存（Public - No Auth）
     * 確認待ち(pending)のPaymentとして登録し、Adminの確認によってcompletedへ更新される
     */
    public function store(Request $request, string $token): RedirectResponse
    {
        $invoice = Invoice::where('payment_report_token', $token)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'payment_method' => ['required', 'in:bank_transfer,credit_card,cash,other'],
            'amount'         => ['required', 'numeric', 'min:0.01', 'max:' . max($invoice->balance, 0.01)],
            'payment_date'   => ['required', 'date'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'notes'          => ['nullable', 'string', 'max:500'],
        ], [
            'payment_method.required' => '支払方法は必須です',
            'payment_method.in'       => '支払方法が無効です',
            'amount.required'         => '金額は必須です',
            'amount.numeric'          => '金額は数値である必要があります',
            'amount.min'              => '金額は0より大きい必要があります',
            'amount.max'              => 'ご入力の金額が請求書の残額（' . number_format($invoice->balance) . '円）を超えています。',
            'payment_date.required'   => '支払い日は必須です',
            'payment_date.date'       => '支払い日は有効な日付である必要があります',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $payment = $this->paymentService->create([
            'invoice_id' => $invoice->id,
            'company_id' => $invoice->company_id,
            ...$validator->validated(),
            'status' => 'pending',
        ]);

        Notification::send(Admin::all(), new PaymentReported($payment));

        return redirect()->route('invoice.payment.show', $token)
            ->with('success', '入金報告を送信しました。管理者の確認をお待ちください。');
    }
}
