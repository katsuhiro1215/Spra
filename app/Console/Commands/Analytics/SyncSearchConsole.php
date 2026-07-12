<?php

namespace App\Console\Commands\Analytics;

use App\Contracts\SearchConsoleServiceInterface;
use App\Models\AnalyticsDaily;
use App\Models\AnalyticsDimension;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SyncSearchConsole extends Command
{
    protected $signature = 'analytics:sync-search-console {date? : 同期対象日(YYYY-MM-DD、省略時は3日前)}';

    protected $description = 'Search Consoleの検索パフォーマンスデータをAnalyticsDailyへ同期する（現状はダミーデータ、本番移行時はサービス実装を差し替える）';

    public function __construct(private SearchConsoleServiceInterface $searchConsole)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        // Search Consoleのデータは反映に数日のラグがあるため、デフォルトは3日前
        $date = $this->argument('date')
            ? Carbon::parse($this->argument('date'))->startOfDay()
            : now()->subDays(3)->startOfDay();

        if (!$this->searchConsole->isLive()) {
            $this->warn('Search Console未接続のため、ダミーデータで同期します。');
        }

        $rows = $this->searchConsole->fetchSearchAnalytics($date);

        foreach ($rows as $row) {
            $keywordDimension = AnalyticsDimension::firstOrCreate(
                ['type' => AnalyticsDimension::TYPE_KEYWORD, 'code' => $row['query']],
                ['label' => $row['query']]
            );

            $this->upsert($date, $keywordDimension->id, 'clicks', $row['clicks']);
            $this->upsert($date, $keywordDimension->id, 'impressions', $row['impressions']);
            $this->upsert($date, $keywordDimension->id, AnalyticsDaily::METRIC_AVG_POSITION, $row['position']);

            $pageDimension = AnalyticsDimension::firstOrCreate(
                ['type' => AnalyticsDimension::TYPE_PAGE, 'code' => $row['page']],
                ['label' => $row['page']]
            );

            $this->upsert($date, $pageDimension->id, 'search_clicks', $row['clicks']);
            $this->upsert($date, $pageDimension->id, 'search_impressions', $row['impressions']);
        }

        $this->info("Search Console同期完了: {$date->toDateString()} (" . count($rows) . '件のクエリ)');

        return self::SUCCESS;
    }

    private function upsert(Carbon $date, string $dimensionId, string $metric, float $value): void
    {
        AnalyticsDaily::updateOrCreate(
            ['date' => $date->toDateString(), 'dimension_id' => $dimensionId, 'metric' => $metric],
            ['value' => $value]
        );
    }
}
