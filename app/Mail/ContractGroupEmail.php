<?php

namespace App\Mail;

use App\Models\ContractGroup;
use App\Models\DocumentVersion;
use App\Services\ContractPdfService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractGroupEmail extends Mailable
{
  use Queueable, SerializesModels;

  public ContractGroup $contractGroup;
  public ?DocumentVersion $terms = null;
  public string $recipientEmail;

  /**
   * Create a new message instance.
   */
  public function __construct(
    ContractGroup $contractGroup,
    string $recipientEmail,
    ?DocumentVersion $terms = null
  ) {
    $this->contractGroup = $contractGroup;
    $this->recipientEmail = $recipientEmail;
    $this->terms = $terms;
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    $contractCount = $this->contractGroup->contracts->count();
    $subject = $contractCount > 1
      ? "複数の契約書をお送りします - {$this->contractGroup->title}"
      : "契約書をお送りします - {$this->contractGroup->title}";

    return new Envelope(
      subject: $subject,
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      text: 'emails.contract-group-plain',
      with: [
        'contractGroup' => $this->contractGroup,
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
    $pdfService = new ContractPdfService();

    // グループ内の各契約書を PDF で添付
    foreach ($this->contractGroup->contracts as $index => $contract) {
      try {
        $mpdf = $pdfService->generateFullContract($contract);
        $pdfContent = $mpdf->Output('', 'S');

        // ファイル名にインデックスを付ける（複数の場合）
        $fileName = $this->contractGroup->contracts->count() > 1
          ? sprintf('契約書_%s_%02d_%s.pdf', $this->contractGroup->group_number, $index + 1, $contract->contract_number)
          : $pdfService->getFileName($contract);

        $attachments[] = Attachment::fromData(
          function () use ($pdfContent) {
            return $pdfContent;
          },
          $fileName
        )->withMime('application/pdf');
      } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::warning('Failed to generate contract PDF for group', [
          'contract_group_id' => $this->contractGroup->id,
          'contract_id' => $contract->id,
          'error' => $e->getMessage(),
        ]);
      }
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
