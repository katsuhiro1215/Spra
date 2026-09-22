<?php

namespace Tests\Feature\LegacyDocument;

use App\Models\Admin;
use App\Models\LegacyDocument;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegacyDocumentModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時のbooted()フックがsyncRoles()を呼ぶため、Roleレコードを先に用意する。
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_legacy_document_can_be_created_with_creator(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        $document = LegacyDocument::create([
            'document_type' => 'receipt',
            'client_name' => '株式会社サンプル',
            'issued_at' => '2024-03-15',
            'total_amount' => 330000,
            'notes' => '旧システム移行前の領収書',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($document->creator->is($admin));
        $this->assertSame('receipt', $document->document_type);
        $this->assertEquals(330000, $document->total_amount);
    }

    public function test_document_type_constant_lists_invoice_and_receipt(): void
    {
        $this->assertSame(['invoice', 'receipt'], LegacyDocument::DOCUMENT_TYPES);
    }
}
