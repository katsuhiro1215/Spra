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

class InvoiceNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftInvoice(User $user, Admin $admin, string $invoiceNumber): Invoice
    {
        $contract = Contract::create([
            'contract_number' => 'C-INV-' . Str::random(6),
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        return Invoice::create([
            'invoice_number' => $invoiceNumber,
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'draft',
            'subtotal' => 100000,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
        ]);
    }

    public function test_admin_can_edit_the_invoice_number_while_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $invoice = $this->makeDraftInvoice($user, $admin, 'INV-' . now()->format('Ym') . '-0001');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.invoice.update', $invoice->id),
            [
                'issue_date' => $invoice->issue_date->toDateString(),
                'due_date' => $invoice->due_date->toDateString(),
                'user_id' => $user->id,
                'status' => 'draft',
                'subtotal' => 100000,
                'tax_rate' => 10,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'invoice_number' => 'INV-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('INV-' . now()->format('Ym') . '-9999', $invoice->fresh()->invoice_number);
    }

    public function test_invoice_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $existing = $this->makeDraftInvoice($user, $admin, 'INV-' . now()->format('Ym') . '-0001');
        $target = $this->makeDraftInvoice($user, $admin, 'INV-' . now()->format('Ym') . '-0002');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.invoice.update', $target->id),
            [
                'issue_date' => $target->issue_date->toDateString(),
                'due_date' => $target->due_date->toDateString(),
                'user_id' => $user->id,
                'status' => 'draft',
                'subtotal' => 100000,
                'tax_rate' => 10,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'invoice_number' => $existing->invoice_number,
            ],
        );

        $response->assertSessionHasErrors('invoice_number');
    }
}
