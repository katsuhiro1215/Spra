<?php

namespace App\Mail;

use App\Models\Quote;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendQuoteMail extends Mailable
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   */
  public function __construct(
    private Quote $quote,
    private string $responseFormUrl = ''
  ) {}

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    $recipientName = $this->getRecipientName();

    return new Envelope(
      subject: "[見積もり] {$this->quote->quote_number} - {$this->quote->title}",
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.quote.send',
      with: [
        'quote' => $this->quote,
        'recipientName' => $this->getRecipientName(),
        'recipientEmail' => $this->getRecipientEmail(),
        'responseFormUrl' => $this->responseFormUrl,
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

  /**
   * Get recipient name
   */
  private function getRecipientName(): string
  {
    if ($this->quote->user?->profile?->full_name) {
      return $this->quote->user->profile->full_name;
    }
    if ($this->quote->user?->email) {
      return $this->quote->user->email;
    }
    if ($this->quote->contact?->name) {
      return $this->quote->contact->name;
    }
    return 'クライアント';
  }

  /**
   * Get recipient email
   */
  private function getRecipientEmail(): string
  {
    if ($this->quote->user?->email) {
      return $this->quote->user->email;
    }
    if ($this->quote->contact?->email) {
      return $this->quote->contact->email;
    }
    return '';
  }
}
