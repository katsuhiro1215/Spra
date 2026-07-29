<?php

namespace Tests\Feature\Invoice;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class GenerateMonthlyInvoicesCommandTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeContract(array $overrides = []): Contract
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $contract = Contract::create(array_merge([
            'contract_number' => 'C-CMD-' . Str::random(8),
            'user_id' => $user->id,
            'title' => 'コマンドテスト契約',
            'type' => 'monthly',
            'start_date' => now()->subMonth()->startOfMonth()->toDateString(),
            'billing_day' => 10,
            'payment_due_days' => 15,
            'auto_invoice_generation' => true,
            'status' => 'active',
            'created_by' => $admin->id,
        ], $overrides));

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 50000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 5000,
            'total_amount' => 55000,
            'status' => 'active',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $contract->update(['current_version_id' => $version->id]);

        return $contract->fresh();
    }

    public function test_command_generates_invoice_only_for_eligible_contracts(): void
    {
        Mail::fake();
        Storage::fake('private');

        $eligible = $this->makeContract();
        $inactive = $this->makeContract(['status' => 'suspended']);
        $autoGenerationOff = $this->makeContract(['auto_invoice_generation' => false]);
        $oneTime = $this->makeContract(['type' => 'one_time']);

        $this->artisan('invoices:generate-monthly')->assertSuccessful();

        $this->assertSame(1, $eligible->invoices()->count());
        $this->assertSame(0, $inactive->invoices()->count());
        $this->assertSame(0, $autoGenerationOff->invoices()->count());
        $this->assertSame(0, $oneTime->invoices()->count());
    }
}
