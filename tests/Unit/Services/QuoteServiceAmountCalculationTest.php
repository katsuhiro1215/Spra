<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Campaign;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\QuoteVersion;
use App\Services\QuoteService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class QuoteServiceAmountCalculationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeVersion(?string $campaignId = null, float $discountAmount = 0, float $taxRate = 10): QuoteVersion
    {
        $admin = Admin::factory()->create();

        $quote = Quote::create([
            'quote_number' => 'Q-CALC-' . Str::random(8),
            'title' => '金額計算テスト見積もり',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        return QuoteVersion::create([
            'quote_id' => $quote->id,
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 0,
            'discount_amount' => $discountAmount,
            'tax_rate' => $taxRate,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'draft',
            'is_current' => true,
            'campaign_id' => $campaignId,
            'created_by' => $admin->id,
        ]);
    }

    public function test_recalculate_sums_items_and_applies_tax_without_campaign(): void
    {
        $version = $this->makeVersion();

        QuoteItem::create([
            'quote_version_id' => $version->id,
            'name' => '項目A',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        app(QuoteService::class)->recalculateVersionAmounts($version);
        $version->refresh();

        $this->assertEquals(100000, (float) $version->base_amount);
        $this->assertEquals(10000, (float) $version->tax_amount);
        $this->assertEquals(110000, (float) $version->total_amount);
    }

    public function test_recalculate_applies_percentage_campaign_discount_automatically(): void
    {
        $admin = Admin::factory()->create();
        $campaign = Campaign::create([
            'name' => '20%オフキャンペーン',
            'code' => 'CAMP-' . Str::random(6),
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        $version = $this->makeVersion(campaignId: $campaign->id, discountAmount: 0);

        QuoteItem::create([
            'quote_version_id' => $version->id,
            'name' => '項目A',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        app(QuoteService::class)->recalculateVersionAmounts($version);
        $version->refresh();

        // 100000 - 20%(20000) = 80000、税10% = 8000、合計88000
        $this->assertEquals(20000, (float) $version->discount_amount);
        $this->assertEquals(8000, (float) $version->tax_amount);
        $this->assertEquals(88000, (float) $version->total_amount);
    }

    public function test_recalculate_falls_back_to_stored_discount_when_campaign_inactive(): void
    {
        $admin = Admin::factory()->create();
        $expiredCampaign = Campaign::create([
            'name' => '終了済みキャンペーン',
            'code' => 'CAMP-' . Str::random(6),
            'discount_type' => 'percentage',
            'discount_value' => 50,
            'starts_at' => now()->subDays(10),
            'ends_at' => now()->subDay(),
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        $version = $this->makeVersion(campaignId: $expiredCampaign->id, discountAmount: 5000);

        QuoteItem::create([
            'quote_version_id' => $version->id,
            'name' => '項目A',
            'quantity' => 1,
            'unit_price' => 100000,
            'amount' => 100000,
        ]);

        app(QuoteService::class)->recalculateVersionAmounts($version);
        $version->refresh();

        // キャンペーンが期限切れのため、保存済みのdiscount_amount(5000)がそのまま使われる
        $this->assertEquals(5000, (float) $version->discount_amount);
        $this->assertEquals(9500, (float) $version->tax_amount); // (100000-5000)*10%
        $this->assertEquals(104500, (float) $version->total_amount);
    }
}
