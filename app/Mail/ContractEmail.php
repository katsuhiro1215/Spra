<?php

namespace App\Mail;

use App\Models\Contract;
use App\Models\Term;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractEmail extends Mailable
{
    use Queueable, SerializesModels;

    public Contract $contract;
    public ?Term $terms = null;
    public string $recipientEmail;

    /**
     * Create a new message instance.
     */
    public function __construct(Contract $contract, string $recipientEmail, ?Term $terms = null)
    {
        $this->contract = $contract;
        $this->recipientEmail = $recipientEmail;
        $this->terms = $terms;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "契約書をお送りします - {$this->contract->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            text: 'emails.contract-plain',
            with: [
                'contract' => $this->contract,
                'terms' => $this->terms,
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
        $attachments = [];

        // 規約をPDFで添付（有効な規約がある場合）
        if ($this->terms) {
            $attachments[] = Attachment::fromData(
                function () {
                    return $this->generateTermsPdf($this->terms);
                },
                'terms_and_conditions.pdf'
            )->withMime('application/pdf');
        }

        return $attachments;
    }

    /**
     * 規約をPDFとして生成
     */
    private function generateTermsPdf(Term $term): string
    {
        $html = <<<HTML
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: DejaVu Sans, sans-serif; line-height: 1.6; margin: 20px; }
                    h1 { font-size: 24px; margin-bottom: 20px; }
                    h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
                    .footer { margin-top: 40px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <h1>{$term->title}</h1>
                <p>発効日: {$term->effective_date}</p>
                <hr>
                {$term->content}
                <div class="footer">
                    <p>このドキュメントは {$term->title} v{$term->version} です。</p>
                </div>
            </body>
        </html>
        HTML;

        // Markdown or HTML をそのまま使用
        return $html;
    }
}
