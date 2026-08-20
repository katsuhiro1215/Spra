<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ContractItemManualAddTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_add_a_manual_item_without_selecting_a_service(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();

        $contract = Contract::create([
            'contract_number' => 'C-MANUAL-' . Str::random(8),
            'user_id' => $user->id,
            'title' => '手動明細テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 0,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $contract->update(['current_version_id' => $version->id]);

        $response = $this->actingAs($admin, 'admins')->post(
            route('admin.contract.item.store', $contract->id),
            [
                'items' => [
                    [
                        'service_id' => null,
                        'service_item_id' => null,
                        'name' => '手動追加項目',
                        'description' => null,
                        'item_type' => 'custom',
                        'billing_type' => 'one_time',
                        'quantity' => 1,
                        'unit_price' => 50000,
                        'estimated_days' => 0,
                        'sort_order' => 0,
                    ],
                ],
                'tax_rate' => 10,
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertDatabaseHas('contract_items', [
            'name' => '手動追加項目',
            'service_id' => null,
        ]);
    }
}
