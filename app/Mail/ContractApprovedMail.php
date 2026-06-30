<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Company;
use App\Models\Quote;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractApprovedMail extends Mailable
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   */
  public function __construct(
    private User $user,
    private Company $company,
    private Quote $quote,
    private Invoice $invoice
  ) {}

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: "[契約確認] 登録ありがとうございました",
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.onboarding.contract-approved',
      with: [
        'user' => $this->user,
        'company' => $this->company,
        'quote' => $this->quote,
        'invoice' => $this->invoice,
      ],
    );
  }
}
