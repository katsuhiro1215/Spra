<?php

namespace App\Console\Commands\Analytics;

use App\Models\AnalyticsDaily;
use App\Models\AnalyticsDimension;
use App\Models\AnalyticsEvent;
use App\Models\AnalyticsKpi;
use App\Models\Contact;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Quote;
use App\Support\Analytics\ReferrerClassifier;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AggregateDailyAnalytics extends Command
{
    protected $signature = 'analytics:aggregate-daily {date? : 集計対象日(YYYY-MM-DD、省略時は前日)}';

    protected $description = 'AnalyticsEventおよび既存の業務データから日次集計(AnalyticsDaily/AnalyticsKpi)を作成する';

    public function handle(): int
    {
        $date = $this->argument('date')
            ? Carbon::parse($this->argument('date'))->startOfDay()
            : now()->subDay()->startOfDay();

        $this->info("集計対象日: {$date->toDateString()}");

        DB::transaction(function () use ($date) {
            $this->aggregateAccessAnalytics($date);
            $this->aggregateBusinessKpis($date);
        });

        $this->info('集計が完了しました。');

        return self::SUCCESS;
    }

    /**
     * AnalyticsEventからページ・流入元・デバイス・ブラウザの日次集計を作成
     */
    private function aggregateAccessAnalytics(Carbon $date): void
    {
        $events = AnalyticsEvent::query()
            ->ofType(AnalyticsEvent::TYPE_PAGEVIEW)
            ->betweenDates($date->copy()->startOfDay(), $date->copy()->endOfDay())
            ->get();

        if ($events->isEmpty()) {
            $this->line('  対象日のイベントがありません（アクセス解析集計をスキップ）');
            return;
        }

        $requestHost = parse_url(config('app.url'), PHP_URL_HOST) ?? '';

        // サイト全体の合計（ページ別集計はページをまたぐ重複訪問者を含むため、
        // サイト全体のユニーク訪問者数は別途ここで正しく算出する）
        $siteDimension = AnalyticsDimension::firstOrCreate(
            ['type' => AnalyticsDimension::TYPE_SITE, 'code' => 'total'],
            ['label' => 'サイト全体']
        );
        $this->upsertDaily($date, $siteDimension->id, AnalyticsDaily::METRIC_VIEWS, $events->count());
        $this->upsertDaily($date, $siteDimension->id, AnalyticsDaily::METRIC_VISITORS, $events->pluck('visitor_hash')->unique()->count());

        // ページ別
        $this->aggregateDimension(
            $date,
            AnalyticsDimension::TYPE_PAGE,
            $events->groupBy('url'),
            fn (string $url) => ['code' => $url, 'label' => $url]
        );

        // デバイス別
        $this->aggregateDimension(
            $date,
            AnalyticsDimension::TYPE_DEVICE,
            $events->groupBy(fn ($e) => $e->device_type ?? 'unknown'),
            fn (string $device) => ['code' => $device, 'label' => $device]
        );

        // ブラウザ別
        $this->aggregateDimension(
            $date,
            AnalyticsDimension::TYPE_BROWSER,
            $events->groupBy(fn ($e) => $e->browser ?? 'unknown'),
            fn (string $browser) => ['code' => $browser, 'label' => $browser]
        );

        // 流入元別（ReferrerClassifierで正規化）
        $referrerGroups = $events->groupBy(function ($event) use ($requestHost) {
            $classified = ReferrerClassifier::classify(
                $event->referrer_url,
                $event->utm_source,
                $event->utm_medium,
                $requestHost
            );

            return $classified['code'];
        });

        foreach ($referrerGroups as $code => $groupEvents) {
            $sample = $groupEvents->first();
            $classified = ReferrerClassifier::classify(
                $sample->referrer_url,
                $sample->utm_source,
                $sample->utm_medium,
                $requestHost
            );

            $dimension = AnalyticsDimension::firstOrCreate(
                ['type' => AnalyticsDimension::TYPE_REFERRER, 'code' => $classified['code']],
                ['label' => $classified['label']]
            );

            $this->upsertDaily($date, $dimension->id, AnalyticsDaily::METRIC_VIEWS, $groupEvents->count());
            $this->upsertDaily($date, $dimension->id, AnalyticsDaily::METRIC_VISITORS, $groupEvents->pluck('visitor_hash')->unique()->count());
        }

        $this->line("  アクセス解析: {$events->count()}件のイベントを集計しました");
    }

    /**
     * グループ化済みイベントをディメンション別にAnalyticsDailyへ集計する
     */
    private function aggregateDimension(Carbon $date, string $type, $groups, callable $resolveDimension): void
    {
        foreach ($groups as $key => $groupEvents) {
            $key = (string) $key;
            $meta = $resolveDimension($key);

            $dimension = AnalyticsDimension::firstOrCreate(
                ['type' => $type, 'code' => $meta['code']],
                ['label' => $meta['label']]
            );

            $this->upsertDaily($date, $dimension->id, AnalyticsDaily::METRIC_VIEWS, $groupEvents->count());
            $this->upsertDaily($date, $dimension->id, AnalyticsDaily::METRIC_VISITORS, $groupEvents->pluck('visitor_hash')->unique()->count());
        }
    }

    private function upsertDaily(Carbon $date, string $dimensionId, string $metric, float $value): void
    {
        AnalyticsDaily::updateOrCreate(
            ['date' => $date->toDateString(), 'dimension_id' => $dimensionId, 'metric' => $metric],
            ['value' => $value]
        );
    }

    /**
     * 既存の業務データ(Contact/Quote/Contract/Payment/Project)から全社KPIを集計
     */
    private function aggregateBusinessKpis(Carbon $date): void
    {
        $newContacts = Contact::whereDate('created_at', $date)->count();
        $quoteCount = Quote::whereDate('created_at', $date)->count();
        $newContracts = Contract::whereDate('created_at', $date)->count();
        $revenue = (float) Payment::where('status', 'completed')
            ->whereDate('payment_date', $date)
            ->sum('amount');
        $activeProjects = Project::whereNotIn('status', ['completed', 'cancelled'])->count();
        $overdueProjects = Project::whereNotIn('status', ['completed', 'cancelled'])
            ->whereNotNull('estimated_end_date')
            ->whereDate('estimated_end_date', '<', $date)
            ->count();
        $conversionRate = $quoteCount > 0 ? round($newContracts / $quoteCount, 4) : 0;

        $kpis = [
            'new_contacts' => $newContacts,
            'quote_count' => $quoteCount,
            'new_contracts' => $newContracts,
            'revenue' => $revenue,
            'active_projects' => $activeProjects,
            'overdue_projects' => $overdueProjects,
            'conversion_rate' => $conversionRate,
        ];

        foreach ($kpis as $kpiKey => $value) {
            AnalyticsKpi::updateOrCreate(
                [
                    'period_type' => AnalyticsKpi::PERIOD_DAILY,
                    'period_date' => $date->toDateString(),
                    'dimension_type' => null,
                    'dimension_id' => null,
                    'kpi_key' => $kpiKey,
                ],
                ['value' => $value]
            );
        }

        $this->line('  業務KPI: ' . implode(', ', array_map(
            fn ($k, $v) => "{$k}={$v}",
            array_keys($kpis),
            $kpis
        )));
    }
}
