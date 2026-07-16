import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import TabNavigation from "@/Components/TabNavigation";
import LineChart, { CHART_COLORS } from "@/Components/Charts/LineChart";
import BarChart from "@/Components/Charts/BarChart";
// Icons
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const formatNumber = (v) => new Intl.NumberFormat("ja-JP").format(Math.round(v || 0));
const formatCurrency = (v) =>
    new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(v || 0);
const formatPercent = (v) => `${((v || 0) * 100).toFixed(1)}%`;
const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};
const formatMonth = (d) => {
    const [y, m] = d.split("-");
    return `${y}/${parseInt(m, 10)}`;
};
const formatYear = (d) => `${d}年`;

function SegmentedButtons({ options, value, onChange }) {
    return (
        <div className="inline-flex rounded-md shadow-sm">
            {options.map((opt, idx) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1.5 text-sm font-medium border ${
                        idx === 0
                            ? "rounded-l-md"
                            : idx === options.length - 1
                              ? "rounded-r-md"
                              : ""
                    } ${
                        value === opt.value
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function StatTile({ label, value, sub }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
            <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {value}
            </div>
            {sub && (
                <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{sub}</div>
            )}
        </div>
    );
}

export default function Index({
    days,
    traffic,
    referrers,
    devices,
    keywords,
    business,
    isSearchConsoleLive,
}) {
    const initialTab = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        return ["overview", "traffic", "referrers", "keywords", "business"].includes(tab)
            ? tab
            : "overview";
    }, []);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [salesPeriod, setSalesPeriod] = useState("daily");

    const handleDaysChange = (newDays) => {
        router.get(
            route("admin.analytics.index"),
            { days: newDays, tab: activeTab },
            { preserveState: true, preserveScroll: true },
        );
    };

    const tabs = [
        { key: "overview", label: "概要" },
        { key: "traffic", label: "アクセス解析" },
        { key: "referrers", label: "流入元" },
        { key: "keywords", label: "検索キーワード" },
        { key: "business", label: "業務KPI" },
    ];

    const dayOptions = [
        { value: 7, label: "過去7日間" },
        { value: 30, label: "過去30日間" },
        { value: 90, label: "過去90日間" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <StatTile
                                label="ページビュー"
                                value={formatNumber(traffic.totalViews)}
                            />
                            <StatTile
                                label="ユニーク訪問者"
                                value={formatNumber(traffic.totalVisitors)}
                            />
                            <StatTile
                                label="売上"
                                value={formatCurrency(business.totals.revenue)}
                            />
                            <StatTile
                                label="新規問い合わせ"
                                value={formatNumber(business.totals.new_contacts)}
                            />
                            <StatTile
                                label="新規契約"
                                value={formatNumber(business.totals.new_contracts)}
                            />
                            <StatTile
                                label="成約率"
                                value={formatPercent(business.totals.conversion_rate)}
                                sub="見積→契約"
                            />
                        </div>
                        <Card>
                            <CardHeader>ページビュー推移</CardHeader>
                            <CardBody>
                                <LineChart
                                    data={traffic.trend}
                                    series={[
                                        {
                                            key: "views",
                                            label: "PV",
                                            color: CHART_COLORS.blue.light,
                                        },
                                    ]}
                                    formatDate={formatDate}
                                />
                            </CardBody>
                        </Card>
                    </div>
                );

            case "traffic":
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>PV・UU推移</CardHeader>
                            <CardBody>
                                <LineChart
                                    data={traffic.trend}
                                    series={[
                                        {
                                            key: "views",
                                            label: "ページビュー",
                                            color: CHART_COLORS.blue.light,
                                        },
                                        {
                                            key: "visitors",
                                            label: "ユニーク訪問者",
                                            color: CHART_COLORS.aqua.light,
                                        },
                                    ]}
                                    formatDate={formatDate}
                                />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>人気ページ</CardHeader>
                            <CardBody>
                                <BarChart
                                    data={traffic.topPages.map((p) => ({
                                        label: p.page,
                                        value: p.views,
                                    }))}
                                />
                            </CardBody>
                        </Card>
                    </div>
                );

            case "referrers":
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>流入元</CardHeader>
                            <CardBody>
                                <BarChart
                                    data={referrers.map((r) => ({
                                        label: r.referrer,
                                        value: r.views,
                                    }))}
                                    color={CHART_COLORS.violet.light}
                                />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>デバイス</CardHeader>
                            <CardBody>
                                <BarChart
                                    data={devices.map((d) => ({
                                        label: d.device,
                                        value: d.views,
                                    }))}
                                    color={CHART_COLORS.aqua.light}
                                />
                            </CardBody>
                        </Card>
                    </div>
                );

            case "keywords":
                return (
                    <div className="space-y-4">
                        {!isSearchConsoleLive && (
                            <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                                Search
                                Console未接続のため、現在はダミーデータを表示しています。本番のGoogle
                                Search Console連携後は自動的に実データに切り替わります。
                            </div>
                        )}
                        <Card>
                            <CardHeader>検索キーワード</CardHeader>
                            <Table>
                                <THead>
                                    <Tr hover={false}>
                                        <Th>クエリ</Th>
                                        <Th>クリック数</Th>
                                        <Th>表示回数</Th>
                                        <Th>CTR</Th>
                                        <Th>平均掲載順位</Th>
                                    </Tr>
                                </THead>
                                <TBody>
                                    {keywords.length > 0 ? (
                                        keywords.map((k) => (
                                            <Tr key={k.query}>
                                                <Td>{k.query}</Td>
                                                <Td>{formatNumber(k.clicks)}</Td>
                                                <Td>{formatNumber(k.impressions)}</Td>
                                                <Td>{formatPercent(k.ctr)}</Td>
                                                <Td>{k.position ?? "-"}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td
                                                colSpan={5}
                                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                                            >
                                                データがありません
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        </Card>
                    </div>
                );

            case "business": {
                const salesTrendData =
                    salesPeriod === "monthly"
                        ? business.monthlyTrend
                        : salesPeriod === "yearly"
                          ? business.yearlyTrend
                          : business.trend;
                const salesFormatDate =
                    salesPeriod === "monthly"
                        ? formatMonth
                        : salesPeriod === "yearly"
                          ? formatYear
                          : formatDate;
                const latestRevenue =
                    salesTrendData[salesTrendData.length - 1]?.revenue ?? 0;
                const previousRevenue =
                    salesTrendData[salesTrendData.length - 2]?.revenue ?? 0;
                const revenueChangePct =
                    salesPeriod !== "daily" && previousRevenue > 0
                        ? ((latestRevenue - previousRevenue) / previousRevenue) * 100
                        : null;
                const revenueChangeLabel =
                    salesPeriod === "monthly" ? "前月比" : "前年比";

                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatTile
                                label="売上"
                                value={formatCurrency(business.totals.revenue)}
                            />
                            <StatTile
                                label="見積件数"
                                value={formatNumber(business.totals.quote_count)}
                            />
                            <StatTile
                                label="新規契約"
                                value={formatNumber(business.totals.new_contracts)}
                            />
                            <StatTile
                                label="成約率"
                                value={formatPercent(business.totals.conversion_rate)}
                            />
                            <StatTile
                                label="新規問い合わせ"
                                value={formatNumber(business.totals.new_contacts)}
                            />
                            <StatTile
                                label="進行中プロジェクト"
                                value={formatNumber(business.totals.active_projects)}
                            />
                            <StatTile
                                label="遅延プロジェクト"
                                value={formatNumber(business.totals.overdue_projects)}
                            />
                        </div>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <span>売上推移</span>
                                    <SegmentedButtons
                                        options={[
                                            { value: "daily", label: "日次" },
                                            { value: "monthly", label: "月次" },
                                            { value: "yearly", label: "年次" },
                                        ]}
                                        value={salesPeriod}
                                        onChange={setSalesPeriod}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <LineChart
                                    data={salesTrendData}
                                    series={[
                                        {
                                            key: "revenue",
                                            label: "売上",
                                            color: CHART_COLORS.green.light,
                                        },
                                    ]}
                                    formatValue={formatCurrency}
                                    formatDate={salesFormatDate}
                                />
                                {revenueChangePct !== null && (
                                    <div
                                        className={`mt-2 text-xs font-medium ${
                                            revenueChangePct >= 0
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {revenueChangeLabel}: {revenueChangePct >= 0 ? "+" : ""}
                                        {revenueChangePct.toFixed(1)}%
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>問い合わせ・見積・契約件数の推移</CardHeader>
                            <CardBody>
                                <LineChart
                                    data={salesTrendData}
                                    series={[
                                        {
                                            key: "new_contacts",
                                            label: "問い合わせ",
                                            color: CHART_COLORS.blue.light,
                                        },
                                        {
                                            key: "quote_count",
                                            label: "見積",
                                            color: CHART_COLORS.yellow.light,
                                        },
                                        {
                                            key: "new_contracts",
                                            label: "契約",
                                            color: CHART_COLORS.red.light,
                                        },
                                    ]}
                                    formatDate={salesFormatDate}
                                />
                            </CardBody>
                        </Card>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="📊 分析管理"
                    description="アクセス解析と業務KPIを確認します"
                    breadcrumbs={["ホーム", "分析管理"]}
                />
            }
        >
            <Head title="分析管理" />

            <FlashMessage />

            <div className="space-y-4">
                <div className="flex justify-end">
                    <SegmentedButtons
                        options={dayOptions}
                        value={days}
                        onChange={handleDaysChange}
                    />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    <div className="p-6">{renderTabContent()}</div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
