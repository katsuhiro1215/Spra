<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\LegacyDocument;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LegacyDocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_register_a_legacy_receipt_with_pdf(): void
    {
        Storage::fake('private');
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.legacy-document.store'), [
            'document_type' => 'receipt',
            'client_name' => '株式会社アーカイブ',
            'issued_at' => '2023-01-20',
            'total_amount' => 220000,
            'file' => UploadedFile::fake()->create('receipt.pdf', 80, 'application/pdf'),
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('legacy_documents', [
            'document_type' => 'receipt',
            'client_name' => '株式会社アーカイブ',
            'created_by' => $admin->id,
        ]);

        $document = LegacyDocument::where('client_name', '株式会社アーカイブ')->firstOrFail();
        Storage::disk('private')->assertExists($document->pdf_path);
    }

    public function test_registration_rejects_disallowed_mime_type(): void
    {
        Storage::fake('private');
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.legacy-document.store'), [
            'document_type' => 'invoice',
            'client_name' => 'テスト',
            'issued_at' => '2023-01-20',
            'total_amount' => 100000,
            'file' => UploadedFile::fake()->create('malicious.exe', 10, 'application/x-msdownload'),
        ]);

        $response->assertSessionHasErrors('file');
    }

    public function test_registration_without_file_still_succeeds(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.legacy-document.store'), [
            'document_type' => 'invoice',
            'client_name' => 'ファイル無しクライアント',
            'issued_at' => '2021-05-05',
            'total_amount' => 50000,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('legacy_documents', [
            'client_name' => 'ファイル無しクライアント',
            'pdf_path' => null,
        ]);
    }

    public function test_guest_cannot_register_a_legacy_document(): void
    {
        $response = $this->post(route('admin.legacy-document.store'), ['client_name' => 'テスト']);

        $response->assertRedirect(route('admin.login'));
    }

    public function test_index_filters_by_document_type(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        LegacyDocument::factory()->create([
            'document_type' => 'invoice',
            'client_name' => '請求書クライアント',
            'created_by' => $admin->id,
        ]);
        LegacyDocument::factory()->create([
            'document_type' => 'receipt',
            'client_name' => '領収書クライアント',
            'created_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin, 'admins')
            ->get(route('admin.legacy-document.index', ['document_type' => 'invoice']));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/LegacyDocuments/Index')
            ->has('documents.data', 1)
            ->where('documents.data.0.document_type', 'invoice')
            ->where('documents.data.0.client_name', '請求書クライアント')
        );
    }
}
