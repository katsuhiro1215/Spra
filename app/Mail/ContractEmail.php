<?php

namespace App\Mail;

use App\Models\Contract;
use App\Models\DocumentVersion;
use App\Services\ContractPdfService;
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
    public ?DocumentVersion $terms = null;
    public string $recipientEmail;

    /**
     * Create a new message instance.
     */
    public function __construct(Contract $contract, string $recipientEmail, ?DocumentVersion $terms = null)
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
            view: 'emails.contract',
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

        // 契約書をPDFで添付（4ページ）
        $pdfService = new ContractPdfService();
        try {
            $mpdf = $pdfService->generateFullContract($this->contract);
            $pdfContent = $mpdf->Output('', 'S'); // 文字列として出力

            $attachments[] = Attachment::fromData(
                function () use ($pdfContent) {
                    return $pdfContent;
                },
                $pdfService->getFileName($this->contract)
            )->withMime('application/pdf');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to generate contract PDF', [
                'contract_id' => $this->contract->id,
                'error' => $e->getMessage(),
            ]);
        }

        // 規約をPDFで添付（有効な規約がある場合）
        if ($this->terms) {
            $attachments[] = Attachment::fromData(
                function () use ($pdfService) {
                    return $pdfService->generateDocumentPdf($this->terms)->Output('', 'S');
                },
                'terms_and_conditions.pdf'
            )->withMime('application/pdf');
        }

        return $attachments;
    }
}
