<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * 予約リマインダーメール（クライアント宛て）
 */
class AppointmentReminderMail extends Mailable
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   */
  public function __construct(
    public Appointment $appointment
  ) {}

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: '【予約リマインダー】' . $this->appointment->subject,
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.appointments.reminder',
      with: [
        'appointment' => $this->appointment,
        'slot' => $this->appointment->appointmentSlot,
        'company' => $this->appointment->company,
        'project' => $this->appointment->project,
        'assignedAdmin' => $this->appointment->appointmentSlot->assignedAdmin,
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
