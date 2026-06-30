<?php

namespace App\Notifications;

use App\Models\QuoteResponse;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class QuoteResponseReceived extends Notification implements ShouldQueue
{
  use Queueable;

  /**
   * Create a new notification instance.
   */
  public function __construct(private QuoteResponse $quoteResponse) {}

  /**
   * Get the notification's delivery channels.
   */
  public function via(object $notifiable): array
  {
    return ['database'];
  }

  /**
   * Get the array representation of the notification.
   */
  public function toArray(object $notifiable): array
  {
    return [
      'title' => 'お客様から返信がありました',
      'message' => "見積番号 {$this->quoteResponse->quote->quote_number} に対してお客様から返信がありました。",
      'quote_response_id' => $this->quoteResponse->id,
      'quote_id' => $this->quoteResponse->quote_id,
      'response_type' => $this->quoteResponse->response_type,
      'response_type_label' => $this->quoteResponse->getResponseTypeLabel(),
      'email' => $this->quoteResponse->email,
      'url' => route('admin.quote-response.detail', $this->quoteResponse->id),
    ];
  }
}
