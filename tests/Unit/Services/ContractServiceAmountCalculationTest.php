<?php

namespace Tests\Unit\Services;

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

class ContractServiceAmountCalculationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeVersion(float $discountAmount = 0, float $taxRate = 10): ContractVersion
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-CALC-' . Str::random(8),
            'user_id' => $user->id,
            'title' => '金額計算テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 0,
            'discount_amount' => $discountAmount,
            'tax_rate' => $taxRate,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);

        return $version;
    }

    public function test_recalculate_sums_item_amounts_and_applies_tax(): void
    {
        $version = $this->makeVersion(discountAmount: 0, taxRate: 10);

        ContractItem::create([
            'contract_version_id' => $version->id,
            'name' => '項目A',
            'quantity' => 1,
            'unit_price' => 80000,
            'amount' => 80000,
        ]);
        ContractItem::create([
            'contract_version_id' => $version->id,
            'name' => '項目B',
            'quantity' => 1,
            'unit_price' => 20000,
            'amount' => 20000,
        ]);

        app(ContractService::class)->recalculateVersionAmounts($version);
        $version->refresh();

        $this->assertEquals(100000, (float) $version->base_amount);
        $this->assertEquals(10000, (float) $version->tax_amount); // (100000-0)*10%
        $this->assertEquals(110000, (float) $version->total_amount);
    }

    public function test_recalculate_subtracts_discount_before_applying_tax(): void
    {
        $version = $this->makeVersion(discountAmount: 20000, taxRate: 10);

        ContractItem::create([
            'contract_version_id' => $version->id,
            'name' => '項目A',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        app(ContractService::class)->recalculateVersionAmounts($version);
        $version->refresh();

        $this->assertEquals(100000, (float) $version->base_amount);
        $this->assertEquals(8000, (float) $version->tax_amount); // (100000-20000)*10%
        $this->assertEquals(88000, (float) $version->total_amount); // 80000+8000
    }
}
