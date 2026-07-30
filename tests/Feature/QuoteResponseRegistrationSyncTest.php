<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Quote;
use App\Models\QuoteResponse;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class QuoteResponseRegistrationSyncTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_registration_syncs_user_and_company_back_to_the_original_quote(): void
    {
        // EstimateSimulator経由でゲストとして作成された想定のQuote（user_id/company_id無し）
        $quote = Quote::create([
            'quote_number' => 'Q-SYNC-0001',
            'title' => 'シミュレーター経由の見積もり',
            'status' => 'draft',
            'created_by' => Admin::factory()->create()->id,
        ]);

        $quoteResponse = QuoteResponse::create([
            'quote_id' => $quote->id,
            'token' => Str::random(40),
            'email' => 'sync-test@example.com',
            'response_type' => 'request',
            'responded_at' => now(),
        ]);

        $response = $this->post(route('quote.response.register.store', $quoteResponse->token), [
            'password' => 'Password1234',
            'password_confirmation' => 'Password1234',
            'company_name' => '同期テスト株式会社',
            'company_type' => 'corporate',
            'agreed' => true,
        ]);

        $response->assertRedirect(route('user.login'));

        $user = User::where('email', 'sync-test@example.com')->firstOrFail();
        $this->assertSame('pending', $user->status);

        $quoteResponse->refresh();
        $this->assertSame($user->id, $quoteResponse->user_id);
        $this->assertNotNull($quoteResponse->company_id);

        // 元のQuoteにもUser/Companyが同期されていること（これが無いとUser側ダッシュボードに表示されない）
        $quote->refresh();
        $this->assertSame($user->id, $quote->user_id);
        $this->assertSame($quoteResponse->company_id, $quote->company_id);
    }

    public function test_registration_fails_gracefully_when_token_already_used(): void
    {
        $quote = Quote::create([
            'quote_number' => 'Q-SYNC-0002',
            'title' => '既使用トークンの見積もり',
            'status' => 'draft',
            'created_by' => Admin::factory()->create()->id,
        ]);

        $existingUser = User::factory()->create(['email' => 'already-used@example.com']);

        $quoteResponse = QuoteResponse::create([
            'quote_id' => $quote->id,
            'token' => Str::random(40),
            'email' => 'already-used@example.com',
            'user_id' => $existingUser->id,
        ]);

        $response = $this->post(route('quote.response.register.store', $quoteResponse->token), [
            'password' => 'Password1234',
            'password_confirmation' => 'Password1234',
            'company_name' => '再登録テスト株式会社',
            'company_type' => 'corporate',
            'agreed' => true,
        ]);

        $response->assertRedirect(route('home'));
        $this->assertSame(1, User::where('email', 'already-used@example.com')->count());
    }
}
