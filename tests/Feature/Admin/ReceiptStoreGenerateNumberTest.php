<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReceiptStoreGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_manually_created_receipt_gets_a_number_in_the_new_rcp_format(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = Contract::create([
            'contract_number' => 'C-RCP-' . Str::random(6),
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);
        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('Ym') . '-9998',
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'paid',
            'subtotal' => 100000,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
        ]);

        $this->actingAs($admin, 'admins')->post(route('admin.receipt.store'), [
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'amount' => 100000,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'draft',
        ]);

        $expectedPrefix = 'RCP-' . now()->format('Ym') . '-';
        $this->assertDatabaseHas('receipts', ['invoice_id' => $invoice->id]);
        $receiptNumber = \App\Models\Receipt::where('invoice_id', $invoice->id)->value('receipt_number');
        $this->assertStringStartsWith($expectedPrefix, $receiptNumber);
    }
}
