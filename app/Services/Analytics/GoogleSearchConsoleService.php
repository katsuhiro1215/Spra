<?php

namespace App\Services\Analytics;

use App\Contracts\SearchConsoleServiceInterface;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Google Search Console(Search Analytics API)から実データを取得する実装。
 *
 * 認証はサービスアカウントのJWT Bearer方式（OAuth2のクライアントライブラリは使わず、
 * Laravel標準のHttpファサードとopenssl_signのみで完結させている）。
 * 対象プロパティ(config('services.search_console.site_url'))に、
 * サービスアカウントのメールアドレスをSearch Console側で「所有者」または
 * 「フル」権限のユーザーとして追加しておく必要がある。
 */
class GoogleSearchConsoleService implements SearchConsoleServiceInterface
{
    private const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    private const CACHE_KEY = 'search_console.access_token';

    public function __construct(
        private readonly ?string $credentialsPath,
        private readonly ?string $siteUrl,
    ) {
    }

    public function fetchSearchAnalytics(CarbonInterface $date): array
    {
        $response = Http::withToken($this->getAccessToken())
            ->post($this->searchAnalyticsEndpoint(), [
                'startDate' => $date->toDateString(),
                'endDate' => $date->toDateString(),
                'dimensions' => ['query', 'page'],
                'rowLimit' => 1000,
            ])
            ->throw();

        return array_map(function (array $row) {
            [$query, $page] = $row['keys'];

            return [
                'query' => $query,
                'page' => $page,
                'clicks' => (int) $row['clicks'],
                'impressions' => (int) $row['impressions'],
                'ctr' => round((float) $row['ctr'], 4),
                'position' => round((float) $row['position'], 1),
            ];
        }, $response->json('rows', []));
    }

    public function isLive(): bool
    {
        return true;
    }

    private function searchAnalyticsEndpoint(): string
    {
        if (!$this->siteUrl) {
            throw new RuntimeException('SEARCH_CONSOLE_SITE_URLが設定されていません。');
        }

        return 'https://www.googleapis.com/webmasters/v3/sites/'
            . rawurlencode($this->siteUrl)
            . '/searchAnalytics/query';
    }

    private function getAccessToken(): string
    {
        return Cache::remember(self::CACHE_KEY, now()->addMinutes(50), function () {
            $response = Http::asForm()->post(self::TOKEN_URL, [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $this->buildJwtAssertion($this->loadCredentials()),
            ])->throw();

            return $response->json('access_token');
        });
    }

    /**
     * @return array{client_email: string, private_key: string}
     */
    private function loadCredentials(): array
    {
        if (!$this->credentialsPath || !is_readable($this->credentialsPath)) {
            throw new RuntimeException(
                "Search Consoleサービスアカウント鍵ファイルが見つかりません: {$this->credentialsPath}"
            );
        }

        $credentials = json_decode(file_get_contents($this->credentialsPath), true);

        if (!isset($credentials['client_email'], $credentials['private_key'])) {
            throw new RuntimeException('サービスアカウント鍵ファイルの形式が不正です（client_email/private_keyが見つかりません）。');
        }

        return $credentials;
    }

    /**
     * @param array{client_email: string, private_key: string} $credentials
     */
    private function buildJwtAssertion(array $credentials): string
    {
        $now = now()->timestamp;

        $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
        $claims = $this->base64UrlEncode(json_encode([
            'iss' => $credentials['client_email'],
            'scope' => self::SCOPE,
            'aud' => self::TOKEN_URL,
            'iat' => $now,
            'exp' => $now + 3600,
        ]));

        $signingInput = "{$header}.{$claims}";

        openssl_sign($signingInput, $signature, $credentials['private_key'], 'sha256WithRSAEncryption');

        return "{$signingInput}." . $this->base64UrlEncode($signature);
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
