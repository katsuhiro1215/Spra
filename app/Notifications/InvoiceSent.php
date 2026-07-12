<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Notifications\Notification;

class InvoiceSent extends Notification
{
    public function __construct(private Invoice $invoice) {}

    /**
     * database チャンネルのみ（同期実行・キューワーカー不要）
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => '請求書が届いています',
            'message' => "請求書 {$this->invoice->invoice_number}（¥" . number_format((float) $this->invoice->total_amount) . "）が届いています。",
            'invoice_id' => $this->invoice->id,
            'url' => route('user.invoice.show', $this->invoice->id),
        ];
    }
}
