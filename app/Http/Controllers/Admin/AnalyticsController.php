<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsDaily;
use App\Models\AnalyticsDimension;
use App\Models\AnalyticsKpi;
use App\Models\Company;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * 分析ダッシュボード（概要・アクセス解析・流入元・検索キーワード・業務KPIをタブ表示）
     */
    public function index(Request $request): Response
    {
        $days = (int) $request->input('days', 30);
        $days = in_array($days, [7, 30, 90], true) ? $days : 30;

        $endDate = today();
        $startDate = $endDate->copy()->subDays($days - 1);

        return Inertia::render('Admin/Analytics/Index', [
            'days' => $days,
            'traffic' => $this->getTrafficData($startDate, $endDate),
            'referrers' => $this->getReferrerData($startDate, $endDate),
            'devices' => $this->getDeviceData($startDate, $endDate),
            'keywords' => $this->getKeywordData($startDate, $endDate),
            'business' => $this->getBusinessData($startDate, $endDate),
            'isSearchConsoleLive' => config('services.search_console.driver') === 'google',
            'prefectureContracts' => $this->getPrefectureData(),
        ]);
    }

    /**
     * 契約実績のある企業を都道府県別に集計（地図の色分け表示用）
     *
     * 「契約した」とみなすのは実際に成立したことのある契約のみ
     * （下書き・署名待ち・キャンセルは対象外）。企業の住所は
     * デフォルト設定された有効な住所を使用する。
     */
    private function getPrefectureData(): array
    {
        $acquiredStatuses = ['active', 'suspended', 'completed'];

        $counts = Company::query()
            ->whereHas('contracts', fn ($q) => $q->whereIn('status', $acquiredStatuses))
            ->join('addresses', function ($join) {
                $join->on('addresses.addressable_id', '=', 'companies.id')
                    ->where('addresses.addressable_type', Company::class)
                    ->where('addresses.is_default', true)
                    ->where('addresses.is_active', true);
            })
            ->whereNotNull('addresses.prefecture')
            ->select('addresses.prefecture', DB::raw('COUNT(DISTINCT companies.id) as company_count'))
            ->groupBy('addresses.prefecture')
            ->pluck('company_count', 'addresses.prefecture');

        return [
            'counts' => $counts,
            'totalCompanies' => (int) $counts->sum(),
        ];
    }

    /**
     * サイト全体のpv/uu推移＋人気ページ
     */
    private function getTrafficData(Carbon $startDate, Carbon $endDate): array
    {
        $siteDimensionId = AnalyticsDimension::ofType(AnalyticsDimension::TYPE_SITE)
            ->where('code', 'total')
            ->value('id');

        $trend = [];
        if ($siteDimensionId) {
            $rows = AnalyticsDaily::where('dimension_id', $siteDimensionId)
                ->betweenDates($startDate, $endDate)
                ->whereIn('metric', [AnalyticsDaily::METRIC_VIEWS, AnalyticsDaily::METRIC_VISITORS])
                ->get()
                ->groupBy(fn ($row) => $row->date->toDateString());

            foreach ($rows as $date => $metrics) {
                $trend[] = [
                    'date' => $date,
                    'views' => (float) ($metrics->firstWhere('metric', AnalyticsDaily::METRIC_VIEWS)->value ?? 0),
                    'visitors' => (float) ($metrics->firstWhere('metric', AnalyticsDaily::METRIC_VISITORS)->value ?? 0),
                ];
            }
            usort($trend, fn ($a, $b) => $a['date'] <=> $b['date']);
        }

        $topPages = AnalyticsDaily::query()
            ->join('analytics_dimensions', 'analytics_dimensions.id', '=', 'analytics_daily.dimension_id')
            ->where('analytics_dimensions.type', AnalyticsDimension::TYPE_PAGE)
            ->where('analytics_daily.metric', AnalyticsDaily::METRIC_VIEWS)
            ->whereBetween('analytics_daily.date', [$startDate->toDateString(), $endDate->toDateString()])
            ->select('analytics_dimensions.label as page', DB::raw('SUM(analytics_daily.value) as views'))
            ->groupBy('analytics_dimensions.id', 'analytics_dimensions.label')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['page' => $row->page, 'views' => (float) $row->views]);

        return [
            'trend' => $trend,
            'topPages' => $topPages,
            'totalViews' => array_sum(array_column($trend, 'views')),
            'totalVisitors' => array_sum(array_column($trend, 'visitors')),
        ];
    }

    /**
     * 流入元別の内訳
     */
    private function getReferrerData(Carbon $startDate, Carbon $endDate): array
    {
        return AnalyticsDaily::query()
            ->join('analytics_dimensions', 'analytics_dimensions.id', '=', 'analytics_daily.dimension_id')
            ->where('analytics_dimensions.type', AnalyticsDimension::TYPE_REFERRER)
            ->where('analytics_daily.metric', AnalyticsDaily::METRIC_VIEWS)
            ->whereBetween('analytics_daily.date', [$startDate->toDateString(), $endDate->toDateString()])
            ->select('analytics_dimensions.label as referrer', DB::raw('SUM(analytics_daily.value) as views'))
            ->groupBy('analytics_dimensions.id', 'analytics_dimensions.label')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['referrer' => $row->referrer, 'views' => (float) $row->views])
            ->values()
            ->toArray();
    }

    /**
     * デバイス別の内訳
     */
    private function getDeviceData(Carbon $startDate, Carbon $endDate): array
    {
        return AnalyticsDaily::query()
            ->join('analytics_dimensions', 'analytics_dimensions.id', '=', 'analytics_daily.dimension_id')
            ->where('analytics_dimensions.type', AnalyticsDimension::TYPE_DEVICE)
            ->where('analytics_daily.metric', AnalyticsDaily::METRIC_VIEWS)
            ->whereBetween('analytics_daily.date', [$startDate->toDateString(), $endDate->toDateString()])
            ->select('analytics_dimensions.label as device', DB::raw('SUM(analytics_daily.value) as views'))
            ->groupBy('analytics_dimensions.id', 'analytics_dimensions.label')
            ->orderByDesc('views')
            ->get()
            ->map(fn ($row) => ['device' => $row->device, 'views' => (float) $row->views])
            ->values()
            ->toArray();
    }

    /**
     * 検索キーワード（Search Console由来、現状はダミーデータ）
     */
    private function getKeywordData(Carbon $startDate, Carbon $endDate): array
    {
        return AnalyticsDaily::query()
            ->join('analytics_dimensions', 'analytics_dimensions.id', '=', 'analytics_daily.dimension_id')
            ->where('analytics_dimensions.type', AnalyticsDimension::TYPE_KEYWORD)
            ->whereBetween('analytics_daily.date', [$startDate->toDateString(), $endDate->toDateString()])
            ->select(
                'analytics_dimensions.id',
                'analytics_dimensions.label as query',
                DB::raw("SUM(CASE WHEN analytics_daily.metric = 'clicks' THEN analytics_daily.value ELSE 0 END) as clicks"),
                DB::raw("SUM(CASE WHEN analytics_daily.metric = 'impressions' THEN analytics_daily.value ELSE 0 END) as impressions"),
                DB::raw("AVG(CASE WHEN analytics_daily.metric = 'avg_position' THEN analytics_daily.value ELSE NULL END) as position"),
            )
            ->groupBy('analytics_dimensions.id', 'analytics_dimensions.label')
            ->orderByDesc('clicks')
            ->limit(15)
            ->get()
            ->map(fn ($row) => [
                'query' => $row->query,
                'clicks' => (int) $row->clicks,
                'impressions' => (int) $row->impressions,
                'ctr' => $row->impressions > 0 ? round($row->clicks / $row->impressions, 4) : 0,
                'position' => $row->position ? round((float) $row->position, 1) : null,
            ])
            ->values()
            ->toArray();
    }

    /**
     * 業務KPI（問い合わせ・見積・契約・売上・プロジェクト）
     */
    private function getBusinessData(Carbon $startDate, Carbon $endDate): array
    {
        $rows = AnalyticsKpi::query()
            ->where('period_type', AnalyticsKpi::PERIOD_DAILY)
            ->whereNull('dimension_type')
            ->whereNull('dimension_id')
            ->whereBetween('period_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->get()
            ->groupBy('kpi_key');

        $sumKeys = ['new_contacts', 'quote_count', 'new_contracts', 'revenue'];
        $latestKeys = ['active_projects', 'overdue_projects'];

        $totals = [];
        foreach ($sumKeys as $key) {
            $totals[$key] = (float) ($rows->get($key)?->sum('value') ?? 0);
        }
        foreach ($latestKeys as $key) {
            $totals[$key] = (float) ($rows->get($key)?->sortByDesc('period_date')->first()?->value ?? 0);
        }
        $conversionRates = $rows->get('conversion_rate', collect())->pluck('value');
        $totals['conversion_rate'] = $conversionRates->isNotEmpty()
            ? round((float) $conversionRates->avg(), 4)
            : 0;

        $trend = [];
        foreach (['revenue', 'new_contracts', 'quote_count', 'new_contacts'] as $key) {
            foreach ($rows->get($key, collect()) as $row) {
                $date = $row->period_date->toDateString();
                $trend[$date][$key] = (float) $row->value;
                $trend[$date]['date'] = $date;
            }
        }
        ksort($trend);

        return [
            'totals' => $totals,
            'trend' => array_values($trend),
            'monthlyTrend' => $this->getPeriodTrend('month', 12),
            'yearlyTrend' => $this->getPeriodTrend('year', 5),
        ];
    }

    /**
     * 業務KPI（日次データ）を月次/年次単位に集計する
     * 直近N期間分を0埋めで返す（データがない期間も抜けなく表示するため）
     */
    private function getPeriodTrend(string $unit, int $count): array
    {
        $end = today();
        $start = $unit === 'month'
            ? $end->copy()->subMonths($count - 1)->startOfMonth()
            : $end->copy()->subYears($count - 1)->startOfYear();

        $sumKeys = ['revenue', 'new_contracts', 'quote_count', 'new_contacts'];

        $rows = AnalyticsKpi::query()
            ->companyWide()
            ->period(AnalyticsKpi::PERIOD_DAILY)
            ->whereIn('kpi_key', $sumKeys)
            ->where('period_date', '>=', $start->toDateString())
            ->get();

        $groups = [];
        foreach ($rows as $row) {
            $key = $unit === 'month' ? $row->period_date->format('Y-m') : $row->period_date->format('Y');
            $groups[$key][$row->kpi_key] = ($groups[$key][$row->kpi_key] ?? 0) + (float) $row->value;
        }

        $result = [];
        for ($i = $count - 1; $i >= 0; $i--) {
            $periodDate = $unit === 'month' ? $end->copy()->subMonths($i) : $end->copy()->subYears($i);
            $key = $unit === 'month' ? $periodDate->format('Y-m') : $periodDate->format('Y');
            $result[] = array_merge(
                ['date' => $key],
                array_fill_keys($sumKeys, 0.0),
                $groups[$key] ?? []
            );
        }

        return $result;
    }
}
