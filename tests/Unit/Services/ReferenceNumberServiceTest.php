<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\User;
use App\Services\ReferenceNumberService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReferenceNumberServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeContract(Admin $admin, User $user, string $contractNumber): Contract
    {
        return Contract::create([
            'contract_number' => $contractNumber,
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);
    }

    public function test_generates_first_number_of_the_month_with_sequence_0001(): void
    {
        $service = app(ReferenceNumberService::class);

        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $expectedPrefix = 'CTR-' . now()->format('Ym') . '-0001';
        $this->assertSame($expectedPrefix, $number);
    }

    public function test_increments_sequence_based_on_existing_records_in_the_same_month(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $yearMonth = now()->format('Ym');
        $this->makeContract($admin, $user, "CTR-{$yearMonth}-0001");
        $this->makeContract($admin, $user, "CTR-{$yearMonth}-0002");

        $service = app(ReferenceNumberService::class);
        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $this->assertSame("CTR-{$yearMonth}-0003", $number);
    }

    public function test_ignores_numbers_from_a_different_month_or_different_prefix(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        // 前月分・旧フォーマット（無視されるべき）
        $this->makeContract($admin, $user, 'CTR-202607-0099');
        $this->makeContract($admin, $user, 'C2026070099');

        $service = app(ReferenceNumberService::class);
        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $expected = 'CTR-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }

    public function test_considers_soft_deleted_records_to_avoid_duplicate_numbers(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $yearMonth = now()->format('Ym');
        $contract = $this->makeContract($admin, $user, "CTR-{$yearMonth}-0001");
        $contract->delete();

        $service = app(ReferenceNumberService::class);
        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $this->assertSame("CTR-{$yearMonth}-0002", $number);
    }
}
