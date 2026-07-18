<?php

namespace App\Services;

use App\Models\ProjectDocument;
use App\Models\ProjectDocumentVersion;
use App\Support\PdfFontRegistrar;
use Mpdf\Mpdf;

class ProjectDocumentPdfService
{
    private function newMpdf(): Mpdf
    {
        return new Mpdf(array_merge([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 12,
            'margin_right' => 12,
            'margin_top' => 12,
            'margin_bottom' => 12,
            'tempDir' => storage_path('app/temp'),
            'setAutoTopMargin' => 'pad',
            'setAutoBottomMargin' => 'pad',
        ], PdfFontRegistrar::mpdfConfig()));
    }

    public function generate(ProjectDocument $document, ProjectDocumentVersion $version): Mpdf
    {
        $version->loadMissing([
            'sections.columns',
            'sections.endpoints',
            'sections.features',
            'sections.screens',
            'sections.permissions',
        ]);

        $html = view('project_documents.pdf-template', [
            'document' => $document,
            'version' => $version,
            'generatedAt' => now()->format('Y年m月d日'),
        ])->render();

        $mpdf = $this->newMpdf();
        $mpdf->WriteHTML($html);

        return $mpdf;
    }

    public function getFileName(ProjectDocument $document, ProjectDocumentVersion $version): string
    {
        $label = $document->display_title;

        return "{$label}_v{$version->version}_" . now()->format('Ymd') . '.pdf';
    }
}
