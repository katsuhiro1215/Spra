<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Quote;
use App\Models\QuoteResponse;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Str;
use Tests\TestCase;

class QuoteResponseDeclineReasonTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        // route('quote.response.store')は throttle:5,1 が付いており、
        // 同一プロセス内で複数テストを実行するとレート制限に引っかかるため無効化する
        $this->withoutMiddleware(ThrottleRequests::class);
    }

    private function createQuoteResponse(): QuoteResponse
    {
        $quote = Quote::create([
            'quote_number' => 'Q-DECLINE-0001',
            'title' => '辞退理由テスト用見積もり',
            'status' => 'draft',
            'created_by' => Admin::factory()->create()->id,
        ]);

        return QuoteResponse::create([
            'quote_id' => $quote->id,
            'token' => Str::random(40),
            'email' => 'decline-test@example.com',
        ]);
    }

    public function test_declining_without_a_reason_is_rejected(): void
    {
        $quoteResponse = $this->createQuoteResponse();

        $response = $this->post(route('quote.response.store', $quoteResponse->token), [
            'response_type' => 'decline',
        ]);

        $response->assertSessionHasErrors('decline_reason');

        $quoteResponse->refresh();
        $this->assertNull($quoteResponse->responded_at);
    }

    public function test_declining_with_a_valid_reason_is_saved(): void
    {
        $quoteResponse = $this->createQuoteResponse();

        $response = $this->post(route('quote.response.store', $quoteResponse->token), [
            'response_type' => 'decline',
            'decline_reason' => 'price',
        ]);

        $response->assertSessionDoesntHaveErrors();

        $quoteResponse->refresh();
        $this->assertSame('decline', $quoteResponse->response_type);
        $this->assertSame('price', $quoteResponse->decline_reason);
        $this->assertNotNull($quoteResponse->responded_at);
    }

    public function test_declining_with_an_invalid_reason_code_is_rejected(): void
    {
        $quoteResponse = $this->createQuoteResponse();

        $response = $this->post(route('quote.response.store', $quoteResponse->token), [
            'response_type' => 'decline',
            'decline_reason' => 'not_a_real_reason',
        ]);

        $response->assertSessionHasErrors('decline_reason');
    }

    public function test_decline_reason_is_not_stored_for_non_decline_responses(): void
    {
        $quoteResponse = $this->createQuoteResponse();

        $response = $this->post(route('quote.response.store', $quoteResponse->token), [
            'response_type' => 'request',
            'decline_reason' => 'price',
        ]);

        $response->assertSessionDoesntHaveErrors();

        $quoteResponse->refresh();
        $this->assertSame('request', $quoteResponse->response_type);
        $this->assertNull($quoteResponse->decline_reason);
    }
}
