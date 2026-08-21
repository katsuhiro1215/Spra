<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractItem;
use App\Models\ContractVersion;
use App\Models\User;
use App\Services\ContractService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SplitInvoiceRemainingAmountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_deposit_and_final_invoices_split_evenly_without_1yen_shortfall(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-SPLIT-' . Str::random(8),
            'user_id' => $user->id,
            'title' => '分割請求テスト契約',
            'type' => 'one_time',
            'status' => 'active',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 0,
            'discount_amount' => 69573,
            'tax_rate' => 10,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'active',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $contract->update(['current_version_id' => $version->id]);

        ContractItem::create([
            'contract_version_id' => $version->id,
            'name' => '項目A',
            'quantity' => 1,
            'unit_price' => 342300,
            'amount' => 342300,
        ]);

        app(ContractService::class)->recalculateVersionAmounts($version);
        $contract->refresh();

        // 契約総額はちょうど300,000円になるべき（端数が残っていた不具合の回帰テスト）
        $this->assertEquals(300000, (float) $contract->currentVersion->total_amount);

        // 着手金: 小計136,364円、消費税13,636円、合計150,000円
        $depositResponse = $this->actingAs($admin, 'admins')->post(route('admin.invoice.store'), [
            'contract_id' => $contract->id,
            'invoice_type' => 'deposit',
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'user_id' => $user->id,
            'status' => 'draft',
            'subtotal' => 136364,
            'tax_rate' => 10,
            'tax_amount' => 13636,
            'total_amount' => 150000,
        ]);
        $depositResponse->assertSessionDoesntHaveErrors();

        // 完了金: 残りちょうど150,000円を請求できるべき（以前は残金が149,999.7円と
        // 計算され、1円足りずにエラーになっていた）
        $finalResponse = $this->actingAs($admin, 'admins')->post(route('admin.invoice.store'), [
            'contract_id' => $contract->id,
            'invoice_type' => 'final',
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'user_id' => $user->id,
            'status' => 'draft',
            'subtotal' => 136364,
            'tax_rate' => 10,
            'tax_amount' => 13636,
            'total_amount' => 150000,
        ]);
        $finalResponse->assertSessionDoesntHaveErrors();

        $this->assertEquals(0, $contract->remainingAmount());
    }
}
