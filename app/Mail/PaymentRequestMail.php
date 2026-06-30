<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Company;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentRequestMail extends Mailable
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   */
  public function __construct(
    private User $user,
    private Company $company,
    private Invoice $invoice
  ) {}

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: "[請求書] {$this->invoice->invoice_number} - お支払いのお願い",
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.onboarding.payment-request',
      with: [
        'user' => $this->user,
        'company' => $this->company,
        'invoice' => $this->invoice,
      ],
    );
  }

  /**
   * Optionally attach the invoice PDF
   */
  public function attachments(): array
  {
    return [];
    // If we have a PDF generation service, we can attach it here
    // return [
    //     Attachment::fromPath(storage_path("invoices/{$this->invoice->id}.pdf")),
    // ];
  }
}
