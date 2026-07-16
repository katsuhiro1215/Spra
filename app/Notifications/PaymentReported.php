<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Notifications\Notification;

class PaymentReported extends Notification
{
    public function __construct(private Payment $payment) {}

    /**
     * database チャンネルのみ（同期実行・キューワーカー不要）
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $invoice = $this->payment->invoice;

        return [
            'title' => '入金報告がありました',
            'message' => "請求書 {$invoice->invoice_number}（¥" . number_format((float) $this->payment->amount) . "）についてお客様から入金報告がありました。",
            'payment_id' => $this->payment->id,
            'invoice_id' => $invoice->id,
            'url' => route('admin.invoice.show', $invoice->id),
        ];
    }
}
