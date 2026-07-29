<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\Campaign;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CampaignDiscountCalculationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeCampaign(string $type, float $value): Campaign
    {
        $admin = Admin::factory()->create();

        return Campaign::create([
            'name' => 'テストキャンペーン',
            'code' => 'CAMP-' . Str::random(6),
            'discount_type' => $type,
            'discount_value' => $value,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'created_by' => $admin->id,
        ]);
    }

    public function test_percentage_discount_is_calculated_from_base_amount(): void
    {
        $campaign = $this->makeCampaign('percentage', 20);

        $this->assertEquals(20000, $campaign->calculateDiscount(100000));
    }

    public function test_fixed_discount_is_capped_at_base_amount(): void
    {
        $campaign = $this->makeCampaign('fixed', 50000);

        // 定額割引が金額を超える場合、割引額は元の金額でキャップされる
        $this->assertEquals(30000, $campaign->calculateDiscount(30000));
        $this->assertEquals(50000, $campaign->calculateDiscount(100000));
    }

    public function test_is_currently_active_respects_date_range_and_flag(): void
    {
        $active = $this->makeCampaign('percentage', 10);
        $this->assertTrue($active->isCurrentlyActive());

        $expired = $this->makeCampaign('percentage', 10);
        $expired->update(['ends_at' => now()->subDay()]);
        $this->assertFalse($expired->fresh()->isCurrentlyActive());

        $disabled = $this->makeCampaign('percentage', 10);
        $disabled->update(['is_active' => false]);
        $this->assertFalse($disabled->fresh()->isCurrentlyActive());
    }
}
