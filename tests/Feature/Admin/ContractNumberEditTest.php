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

class ContractNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftContract(Admin $admin, User $user): Contract
    {
        $contract = Contract::create([
            'contract_number' => 'CTR-' . now()->format('Ym') . '-' . Str::padLeft((string) random_int(1, 9998), 4, '0'),
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'status' => 'draft',
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

        return $contract->fresh();
    }

    public function test_admin_can_edit_the_contract_number_while_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => $contract->title,
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => 'CTR-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('CTR-' . now()->format('Ym') . '-9999', $contract->fresh()->contract_number);
    }

    public function test_contract_number_edit_is_ignored_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);
        $contract->update(['status' => 'active']);
        $originalNumber = $contract->contract_number;

        $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => $contract->title,
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => 'CTR-' . now()->format('Ym') . '-9999',
            ],
        );

        $this->assertSame($originalNumber, $contract->fresh()->contract_number);
    }

    public function test_contract_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $existing = $this->makeDraftContract($admin, $user);
        $target = $this->makeDraftContract($admin, $user);

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $target->id),
            [
                'title' => $target->title,
                'start_date' => $target->start_date->toDateString(),
                'contract_number' => $existing->contract_number,
            ],
        );

        $response->assertSessionHasErrors('contract_number');
    }

    public function test_empty_contract_number_is_rejected_and_does_not_blank_the_stored_value(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);
        $originalNumber = $contract->contract_number;

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => $contract->title,
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => '',
            ],
        );

        $response->assertSessionHasErrors('contract_number');
        $this->assertSame($originalNumber, $contract->fresh()->contract_number);
    }

    public function test_malformed_contract_number_does_not_block_the_rest_of_the_update_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);
        $contract->update(['status' => 'active']);

        // 下書き以外の状態で、フォーマット不正・重複した番号を送っても、
        // 番号フィールドが無視されるだけで更新リクエスト全体は失敗してはならない
        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => '更新後のタイトル',
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => 'invalid-format',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('更新後のタイトル', $contract->fresh()->title);
    }
}
