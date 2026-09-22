<?php

namespace Tests\Feature\LegacyDocument;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Receipt;
use App\Services\LegacyDocumentService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegacyDocumentIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_registering_legacy_documents_does_not_touch_invoice_receipt_payment_tables(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $service = app(LegacyDocumentService::class);

        $service->register([
            'document_type' => 'invoice',
            'client_name' => 'クライアントA',
            'issued_at' => '2020-04-01',
            'total_amount' => 100000,
        ], null, $admin->id);

        $service->register([
            'document_type' => 'receipt',
            'client_name' => 'クライアントB',
            'issued_at' => '2020-05-01',
            'total_amount' => 50000,
        ], null, $admin->id);

        $this->assertSame(0, Invoice::count());
        $this->assertSame(0, Receipt::count());
        $this->assertSame(0, Payment::count());
    }
}
