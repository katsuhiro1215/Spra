<?php

namespace App\Mail;

use App\Models\Contact;
use App\Models\UserInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public UserInvitation $invitation;
    public Contact $contact;

    /**
     * Create a new message instance.
     */
    public function __construct(UserInvitation $invitation, Contact $contact)
    {
        $this->invitation = $invitation;
        $this->contact = $contact;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'アカウント作成のご案内 - Smart Sprouts',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.user-invitation',
            with: [
                'invitation' => $this->invitation,
                'contact' => $this->contact,
                'invitationUrl' => $this->invitation->invitation_url,
                'expiresAt' => $this->invitation->expires_at->format('Y年m月d日 H:i'),
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
