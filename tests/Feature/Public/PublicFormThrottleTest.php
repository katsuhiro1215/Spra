<?php

namespace Tests\Feature\Public;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicFormThrottleTest extends TestCase
{
    use RefreshDatabase;

    private function assertThrottled(string $routeName, array $routeParams = []): void
    {
        $url = route($routeName, $routeParams);

        for ($i = 0; $i < 5; $i++) {
            $response = $this->post($url, []);
            $this->assertNotEquals(429, $response->getStatusCode(), "{$routeName} was throttled too early on attempt " . ($i + 1));
        }

        $this->post($url, [])->assertStatus(429);
    }

    public function test_contact_store_is_rate_limited(): void
    {
        $this->assertThrottled('contact.store');
    }

    public function test_quote_response_store_is_rate_limited(): void
    {
        $this->assertThrottled('quote.response.store', ['token' => 'dummy-token']);
    }

    public function test_quote_response_register_store_is_rate_limited(): void
    {
        $this->assertThrottled('quote.response.register.store', ['token' => 'dummy-token']);
    }

    public function test_invoice_payment_store_is_rate_limited(): void
    {
        $this->assertThrottled('invoice.payment.store', ['token' => 'dummy-token']);
    }
}
