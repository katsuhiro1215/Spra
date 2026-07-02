<?php

namespace App\Mail;

use App\Models\QuoteResponse;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class SendQuoteResponseInvitationMail extends Mailable
{
  public function __construct(
    public QuoteResponse $quoteResponse
  ) {}

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'ご見積ありがとうございます。アカウント作成のご案内',
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.quote-response-invitation',
      with: [
        'quoteResponse' => $this->quoteResponse,
      ],
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
