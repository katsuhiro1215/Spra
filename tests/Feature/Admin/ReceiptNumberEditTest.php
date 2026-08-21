<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Receipt;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReceiptNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftReceipt(Admin $admin, User $user, string $receiptNumber): array
    {
        $contract = Contract::create([
            'contract_number' => 'C-RCP-' . Str::random(6),
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('Ym') . '-' . random_int(1000, 9999),
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

        $receipt = Receipt::create([
            'receipt_number' => $receiptNumber,
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'amount' => 100000,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'draft',
        ]);

        return [$invoice, $receipt];
    }

    public function test_admin_can_edit_the_receipt_number_while_not_sent(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        [$invoice, $receipt] = $this->makeDraftReceipt($admin, $user, 'RCP-' . now()->format('Ym') . '-0001');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.receipt.update', $receipt->id),
            [
                'invoice_id' => $invoice->id,
                'user_id' => $user->id,
                'amount' => 100000,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'status' => 'draft',
                'receipt_number' => 'RCP-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('RCP-' . now()->format('Ym') . '-9999', $receipt->fresh()->receipt_number);
    }

    public function test_empty_receipt_number_is_rejected_and_does_not_blank_the_stored_value(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        [$invoice, $receipt] = $this->makeDraftReceipt($admin, $user, 'RCP-' . now()->format('Ym') . '-0001');
        $originalNumber = $receipt->receipt_number;

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.receipt.update', $receipt->id),
            [
                'invoice_id' => $invoice->id,
                'user_id' => $user->id,
                'amount' => 100000,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'status' => 'draft',
                'receipt_number' => '',
            ],
        );

        $response->assertSessionHasErrors('receipt_number');
        $this->assertSame($originalNumber, $receipt->fresh()->receipt_number);
    }

    public function test_receipt_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        [, $existing] = $this->makeDraftReceipt($admin, $user, 'RCP-' . now()->format('Ym') . '-0001');
        [$invoice, $target] = $this->makeDraftReceipt($admin, $user, 'RCP-' . now()->format('Ym') . '-0002');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.receipt.update', $target->id),
            [
                'invoice_id' => $invoice->id,
                'user_id' => $user->id,
                'amount' => 100000,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'status' => 'draft',
                'receipt_number' => $existing->receipt_number,
            ],
        );

        $response->assertSessionHasErrors('receipt_number');
    }
}
