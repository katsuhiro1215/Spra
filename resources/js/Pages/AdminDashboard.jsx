import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import LineChart, { CHART_COLORS } from "@/Components/Charts/LineChart";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Dashboard Components
import SidebarLogs from "./Admin/Logs/SidebarLogs";

const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};
const formatYen = (v) => `¥${new Intl.NumberFormat("ja-JP").format(Math.round(v || 0))}`;
const formatNumber = (v) => new Intl.NumberFormat("ja-JP").format(Math.round(v || 0));

function KpiTile({ label, value }) {
    return (
        <Card>
            <div className="p-5">
                <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                    {value}
                </div>
            </div>
        </Card>
    );
}

function QueueTile({ label, count, route }) {
    const needsAttention = count > 0;

    return (
        <Link href={route} className="block">
            <Card hoverable>
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {label}
                        </div>
                        <div
                            className={`mt-1 text-2xl font-semibold tabular-nums ${
                                needsAttention
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-900 dark:text-gray-100"
                            }`}
                        >
                            {formatNumber(count)}
                        </div>
                    </div>
                    {needsAttention && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            要対応
                        </span>
                    )}
                </div>
            </Card>
        </Link>
    );
}

export default function Dashboard({
    queue = [],
    kpis = [],
    trends = [],
    logs = {},
}) {
    const headerActions = [
        {
            label: PageConfig.dashboard.actions.viewLogs,
            variant: "softBlue",
            route: route("admin.logs.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.dashboard.title}
                    description={PageConfig.dashboard.description}
                    actions={headerActions}
                    updatedAt={new Date().toLocaleString("ja-JP")}
                />
            }
        >
            <Head title={PageConfig.dashboard.documentTitle} />

            <FlashMessage />

            <div className="w-full mx-auto flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6 min-w-0">
                    {/* 要対応キュー */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                            今すぐ対応が必要なもの
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {queue.map((item) => (
                                <QueueTile key={item.label} {...item} />
                            ))}
                        </div>
                    </div>

                    {/* KPIタイル */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                            経営状況
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {kpis.map((kpi) => (
                                <KpiTile key={kpi.label} {...kpi} />
                            ))}
                        </div>
                    </div>

                    {/* トレンドチャート */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>売上推移（直近30日）</CardHeader>
                            <CardBody>
                                <LineChart
                                    data={trends}
                                    series={[
                                        {
                                            key: "revenue",
                                            label: "売上",
                                            color: CHART_COLORS.blue.light,
                                        },
                                    ]}
                                    formatValue={formatYen}
                                    formatDate={formatDate}
                                />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>新規ユーザー推移（直近30日）</CardHeader>
                            <CardBody>
                                <LineChart
                                    data={trends}
                                    series={[
                                        {
                                            key: "newUsers",
                                            label: "新規ユーザー",
                                            color: CHART_COLORS.aqua.light,
                                        },
                                    ]}
                                    formatValue={formatNumber}
                                    formatDate={formatDate}
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* 最近のアクティビティ */}
                <div className="lg:w-80 lg:shrink-0">
                    <div className="h-[720px]">
                        <SidebarLogs logs={logs} moreUrl={route("admin.logs.index")} />
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
