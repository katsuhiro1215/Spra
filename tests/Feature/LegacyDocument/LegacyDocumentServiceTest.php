<?php

namespace Tests\Feature\LegacyDocument;

use App\Models\Admin;
use App\Services\LegacyDocumentService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LegacyDocumentServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_register_stores_uploaded_pdf_and_creates_record(): void
    {
        Storage::fake('private');
        $admin = Admin::factory()->create(['role' => 'admin']);

        $document = app(LegacyDocumentService::class)->register([
            'document_type' => 'invoice',
            'client_name' => '有限会社テスト',
            'issued_at' => '2023-11-01',
            'total_amount' => 550000,
        ], UploadedFile::fake()->create('old-invoice.pdf', 100, 'application/pdf'), $admin->id);

        $this->assertSame($admin->id, $document->created_by);
        $this->assertNotNull($document->pdf_path);
        Storage::disk('private')->assertExists($document->pdf_path);
        $this->assertSame('old-invoice.pdf', $document->original_filename);
        $this->assertSame('application/pdf', $document->mime_type);
        $this->assertNotNull($document->file_size);
        $this->assertGreaterThan(0, $document->file_size);
    }

    public function test_register_without_a_file_leaves_pdf_path_null(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        $document = app(LegacyDocumentService::class)->register([
            'document_type' => 'receipt',
            'client_name' => '個人事業主サンプル',
            'issued_at' => '2022-06-10',
            'total_amount' => 88000,
        ], null, $admin->id);

        $this->assertNull($document->pdf_path);
        $this->assertNull($document->original_filename);
        $this->assertNull($document->mime_type);
        $this->assertNull($document->file_size);
    }
}
