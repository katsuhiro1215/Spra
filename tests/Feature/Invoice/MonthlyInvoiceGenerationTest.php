<?php

namespace Tests\Feature\Invoice;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractItem;
use App\Models\ContractVersion;
use App\Models\User;
use App\Services\InvoiceService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class MonthlyInvoiceGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generate_monthly_invoice_is_sent_immediately_with_pdf_and_history(): void
    {
        Mail::fake();
        Storage::fake('private');

        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-TEST-' . Str::random(6),
            'user_id' => $user->id,
            'title' => '月額契約テスト',
            'type' => 'monthly',
            'start_date' => now()->startOfMonth()->toDateString(),
            'billing_day' => 10,
            'payment_due_days' => 15,
            'auto_invoice_generation' => true,
            'status' => 'active',
            'created_by' => $admin->id,
        ]);

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 100000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'active',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $contract->update(['current_version_id' => $version->id]);

        ContractItem::create([
            'contract_version_id' => $version->id,
            'name' => '月額保守費用',
            'item_type' => 'custom',
            'billing_type' => 'monthly',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        $invoice = app(InvoiceService::class)->generateMonthlyInvoice($contract->fresh());

        // 「下書きのまま残る」旧バグの回帰確認: 生成と同時にsentまで完了していること
        $this->assertSame('sent', $invoice->fresh()->status);
        $this->assertNotNull($invoice->fresh()->sent_at);
        $this->assertNotNull($invoice->fresh()->pdf_path);

        Storage::disk('private')->assertExists($invoice->fresh()->pdf_path);

        $history = $contract->histories()->where('action', 'invoice_sent')->first();
        $this->assertNotNull($history);
        $this->assertSame($user->email, $history->recipient_email);

        // 契約側の次回請求日・最終請求日も更新されていること
        $this->assertNotNull($contract->fresh()->last_invoiced_at);
        $this->assertNotNull($contract->fresh()->next_billing_date);
    }
}
