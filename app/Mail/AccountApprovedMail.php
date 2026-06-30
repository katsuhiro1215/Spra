<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Company;
use App\Models\Quote;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountApprovedMail extends Mailable
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   */
  public function __construct(
    private User $user,
    private Company $company,
    private Quote $quote
  ) {}

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: "[承認完了] アカウントが有効になりました",
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.onboarding.account-approved',
      with: [
        'user' => $this->user,
        'company' => $this->company,
        'quote' => $this->quote,
      ],
    );
  }
}
