<?php

namespace App\Support\Analytics;

class ReferrerClassifier
{
    /**
     * 検索エンジンのドメインパターン
     */
    private const SEARCH_ENGINES = [
        'google' => ['google.'],
        'bing' => ['bing.com'],
        'yahoo' => ['yahoo.', 'search.yahoo'],
    ];

    /**
     * SNSのドメインパターン
     */
    private const SOCIAL_NETWORKS = [
        'facebook' => ['facebook.com', 'fb.com'],
        'twitter' => ['twitter.com', 'x.com', 't.co'],
        'instagram' => ['instagram.com'],
        'linkedin' => ['linkedin.com'],
        'line' => ['line.me'],
    ];

    /**
     * リファラ・UTM情報から流入元ディメンションのcode/labelを判定する
     *
     * @return array{code: string, label: string}
     */
    public static function classify(
        ?string $referrerUrl,
        ?string $utmSource,
        ?string $utmMedium,
        string $requestHost
    ): array {
        // UTM付きの流入は最優先でキャンペーン扱い
        if (!empty($utmSource)) {
            $source = self::normalize($utmSource);
            $medium = !empty($utmMedium) ? self::normalize($utmMedium) : 'campaign';

            return [
                'code' => "campaign_{$source}_{$medium}",
                'label' => "{$utmSource}（{$utmMedium}）",
            ];
        }

        $referrerHost = self::extractHost($referrerUrl);

        // リファラなし、または自サイト内遷移は直接流入
        if (empty($referrerHost) || $referrerHost === self::normalize($requestHost)) {
            return ['code' => 'direct', 'label' => '直接流入'];
        }

        foreach (self::SEARCH_ENGINES as $engine => $patterns) {
            if (self::hostMatches($referrerHost, $patterns)) {
                return [
                    'code' => "organic_{$engine}",
                    'label' => ucfirst($engine) . '（自然検索）',
                ];
            }
        }

        foreach (self::SOCIAL_NETWORKS as $network => $patterns) {
            if (self::hostMatches($referrerHost, $patterns)) {
                return [
                    'code' => "social_{$network}",
                    'label' => ucfirst($network) . '（SNS）',
                ];
            }
        }

        return [
            'code' => 'referral_' . self::normalize($referrerHost),
            'label' => "{$referrerHost}（外部サイト）",
        ];
    }

    private static function hostMatches(string $host, array $patterns): bool
    {
        foreach ($patterns as $pattern) {
            if (str_contains($host, $pattern)) {
                return true;
            }
        }

        return false;
    }

    private static function extractHost(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        $host = parse_url($url, PHP_URL_HOST);

        return $host ? self::normalize($host) : null;
    }

    private static function normalize(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/^www\./', '', $value);

        return preg_replace('/[^a-z0-9]+/', '_', $value);
    }
}
