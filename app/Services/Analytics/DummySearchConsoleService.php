<?php

namespace App\Services\Analytics;

use App\Contracts\SearchConsoleServiceInterface;
use Carbon\CarbonInterface;

/**
 * Search Console未接続時のダミー実装。
 *
 * 本番移行時は config('services.search_console.driver') を 'google' に切り替えると、
 * AppServiceProvider のバインディングにより自動的に GoogleSearchConsoleService に切り替わる。
 */
class DummySearchConsoleService implements SearchConsoleServiceInterface
{
    /**
     * サンプルのクエリ・ページ候補
     */
    private const SAMPLE_ROWS = [
        ['query' => 'ホームページ制作 会社', 'page' => '/service'],
        ['query' => 'Webサイト制作 費用', 'page' => '/service'],
        ['query' => 'ホームページ 保守 料金', 'page' => '/service'],
        ['query' => '会社名 評判', 'page' => '/company'],
        ['query' => 'ホームページ制作 依頼 流れ', 'page' => '/flow'],
        ['query' => 'Web制作 見積もり', 'page' => '/contact'],
        ['query' => 'ホームページ制作 よくある質問', 'page' => '/faq'],
        ['query' => 'コーポレートサイト リニューアル', 'page' => '/service'],
        ['query' => 'ホームページ制作会社 比較', 'page' => '/'],
        ['query' => 'Web制作 ブログ 集客', 'page' => '/blog'],
    ];

    public function fetchSearchAnalytics(CarbonInterface $date): array
    {
        // 日付ごとに決定的な擬似乱数を用いて、実行の度に値がぶれないようにする
        $seed = (int) $date->format('Ymd');

        return array_map(function (array $row, int $index) use ($seed) {
            $rand = self::seededRandom($seed + $index);

            $impressions = 20 + (int) round($rand * 180); // 20〜200
            $clicks = (int) round($impressions * (0.02 + $rand * 0.13)); // CTR 2%〜15%程度
            $clicks = min($clicks, $impressions);
            $ctr = $impressions > 0 ? round($clicks / $impressions, 4) : 0;
            $position = round(3 + $rand * 27, 1); // 3位〜30位程度

            return [
                'query' => $row['query'],
                'page' => $row['page'],
                'clicks' => $clicks,
                'impressions' => $impressions,
                'ctr' => $ctr,
                'position' => $position,
            ];
        }, self::SAMPLE_ROWS, array_keys(self::SAMPLE_ROWS));
    }

    public function isLive(): bool
    {
        return false;
    }

    /**
     * シード値から0〜1の決定的な擬似乱数を生成する
     */
    private static function seededRandom(int $seed): float
    {
        $hash = crc32((string) $seed);

        return ($hash % 10000) / 10000;
    }
}
