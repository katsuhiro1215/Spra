<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * 支払い一覧表示
     * @return \Inertia\Response
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Payments/Index', []);
    }

    /**
     * 支払い作成フォーム表示
     * @return \Inertia\Response
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Payments/Create', []);
    }

    /**
     * 支払い保存
     * @param \App\Http\Requests\PaymentRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(PaymentRequest $request)
    {
        // バリデーションと保存のロジックをここに実装
    }

    /**
     * 支払い詳細表示
     * @param  \App\Models\Payment  $payment
     * @return \Inertia\Response
     */
    public function show(Payment $payment): Response
    {
        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment
        ]);
    }

    /**
     * 支払い編集フォーム表示
     * @param  \App\Models\Payment  $payment
     * @return \Inertia\Response
     */
    public function edit(Payment $payment): Response
    {
        return Inertia::render('Admin/Payments/Edit', [
            'payment' => $payment
        ]);
    }

    /**
     * 支払い更新
     * @param \App\Http\Requests\PaymentRequest $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(PaymentRequest $request, Payment $payment)
    {
        // バリデーションと更新のロジックをここに実装
    }

    /**
     * 支払い削除
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Payment $payment)
    {
        // 削除のロジックをここに実装
    }
}
