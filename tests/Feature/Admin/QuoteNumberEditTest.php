<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Quote;
use App\Models\QuoteVersion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftQuote(Admin $admin, string $quoteNumber): Quote
    {
        $quote = Quote::create([
            'quote_number' => $quoteNumber,
            'title' => 'テスト見積',
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

        return $quote->fresh();
    }

    public function test_admin_can_edit_the_quote_number_while_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $quote = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $quote->id),
            [
                'title' => $quote->title,
                'status' => 'draft',
                'user_id' => $user->id,
                'quote_number' => 'QTE-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('QTE-' . now()->format('Ym') . '-9999', $quote->fresh()->quote_number);
    }

    public function test_quote_number_edit_is_ignored_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $quote = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');
        $quote->update(['status' => 'negotiating']);
        $originalNumber = $quote->quote_number;

        $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $quote->id),
            [
                'title' => $quote->title,
                'status' => 'negotiating',
                'user_id' => $user->id,
                'quote_number' => 'QTE-' . now()->format('Ym') . '-9999',
            ],
        );

        $this->assertSame($originalNumber, $quote->fresh()->quote_number);
    }

    public function test_quote_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $existing = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');
        $target = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0002');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $target->id),
            [
                'title' => $target->title,
                'status' => 'draft',
                'user_id' => $user->id,
                'quote_number' => $existing->quote_number,
            ],
        );

        $response->assertSessionHasErrors('quote_number');
    }

    public function test_malformed_quote_number_does_not_block_the_rest_of_the_update_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $quote = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');
        $quote->update(['status' => 'negotiating']);

        // 下書き以外の状態で、フォーマット不正・重複した番号を送っても、
        // 番号フィールドが無視されるだけで更新リクエスト全体は失敗してはならない
        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $quote->id),
            [
                'title' => '更新後のタイトル',
                'status' => 'negotiating',
                'user_id' => $user->id,
                'quote_number' => 'invalid-format',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('更新後のタイトル', $quote->fresh()->title);
    }
}
