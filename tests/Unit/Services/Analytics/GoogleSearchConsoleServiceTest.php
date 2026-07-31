<?php

namespace Tests\Unit\Services\Analytics;

use App\Services\Analytics\GoogleSearchConsoleService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class GoogleSearchConsoleServiceTest extends TestCase
{
    private function serviceAccountPath(): string
    {
        $keyPair = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
        openssl_pkey_export($keyPair, $privateKey);

        $path = storage_path('app/private/test-search-console-service-account.json');

        file_put_contents($path, json_encode([
            'client_email' => 'test@example-project.iam.gserviceaccount.com',
            'private_key' => $privateKey,
        ]));

        return $path;
    }

    public function test_is_live_returns_true(): void
    {
        $service = new GoogleSearchConsoleService($this->serviceAccountPath(), 'sc-domain:example.com');

        $this->assertTrue($service->isLive());
    }

    public function test_fetch_search_analytics_maps_api_response_to_expected_shape(): void
    {
        $path = $this->serviceAccountPath();

        Http::fake([
            'oauth2.googleapis.com/*' => Http::response(['access_token' => 'dummy-token'], 200),
            'www.googleapis.com/webmasters/*' => Http::response([
                'rows' => [
                    [
                        'keys' => ['ホームページ制作', '/service'],
                        'clicks' => 3,
                        'impressions' => 40,
                        'ctr' => 0.075,
                        'position' => 5.4,
                    ],
                ],
            ], 200),
        ]);

        $service = new GoogleSearchConsoleService($path, 'sc-domain:example.com');

        $rows = $service->fetchSearchAnalytics(Carbon::parse('2026-07-28'));

        $this->assertSame([
            'query' => 'ホームページ制作',
            'page' => '/service',
            'clicks' => 3,
            'impressions' => 40,
            'ctr' => 0.075,
            'position' => 5.4,
        ], $rows[0]);

        Http::assertSent(fn ($request) => str_contains($request->url(), 'oauth2.googleapis.com/token'));
        Http::assertSent(fn ($request) => str_contains($request->url(), rawurlencode('sc-domain:example.com')));
    }

    public function test_missing_credentials_file_throws_exception(): void
    {
        $service = new GoogleSearchConsoleService(storage_path('app/private/does-not-exist.json'), 'sc-domain:example.com');

        $this->expectException(RuntimeException::class);

        $service->fetchSearchAnalytics(Carbon::parse('2026-07-28'));
    }
}
