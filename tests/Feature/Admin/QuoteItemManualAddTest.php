<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Quote;
use App\Models\QuoteVersion;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class QuoteItemManualAddTest extends TestCase
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

        $quote = Quote::create([
            'quote_number' => 'Q-MANUAL-' . Str::random(8),
            'title' => '手動明細テスト見積もり',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        $version = QuoteVersion::create([
            'quote_id' => $quote->id,
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 0,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $version->id]);

        $response = $this->actingAs($admin, 'admins')->post(
            route('admin.quote.item.store', $quote->id),
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
        $response->assertRedirect(route('admin.quote.show', $quote->id));
        $this->assertDatabaseHas('quote_items', [
            'name' => '手動追加項目',
            'service_id' => null,
        ]);
    }
}
