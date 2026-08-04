<?php

namespace Tests\Unit\Services;

use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\DocumentVersion;
use App\Services\ContractPdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractPdfServiceTermsTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_document_pdf_returns_a_real_pdf_not_raw_html(): void
    {
        $category = DocumentCategory::create([
            'name' => '法務',
            'slug' => 'legal',
        ]);

        $document = Document::create([
            'document_category_id' => $category->id,
            'title' => '利用規約',
            'slug' => 'terms-of-service',
            'requires_acceptance' => true,
        ]);

        $version = DocumentVersion::create([
            'document_id' => $document->id,
            'version' => '1.0',
            'content' => '<p>第1条 本規約は...</p>',
            'status' => 'active',
            'effective_date' => '2026-01-01',
        ]);

        // 以前はHTML文字列をそのままapplication/pdfとして返しており、
        // 開封時に破損ファイル扱いになっていた(回帰テスト)。
        $pdfContent = (new ContractPdfService())->generateDocumentPdf($version)->Output('', 'S');

        $this->assertStringStartsWith('%PDF-', $pdfContent);
        $this->assertStringNotContainsString('<html>', $pdfContent);
    }
}
