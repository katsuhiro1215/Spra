import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Dashboard Components
import SidebarLogs from "./Admin/Logs/SidebarLogs";

export default function Dashboard({ stats: statsData = {} }) {
    // ダミーデータ（実際のプロジェクトでは props から受け取る）
    const stats = [
        {
            name: "総ユーザー数",
            value: "1,234",
            change: "+12%",
            changeType: "increase",
            icon: "👥",
        },
        {
            name: "今月の新規登録",
            value: "89",
            change: "+5.2%",
            changeType: "increase",
            icon: "📈",
        },
        {
            name: "返信待ち（見積もり）",
            value: statsData.pendingResponses || "0",
            change: statsData.pendingResponses > 0 ? "要対応" : "なし",
            changeType: statsData.pendingResponses > 0 ? "neutral" : "increase",
            icon: "⏳",
            link: route("admin.quote-response.index", { status: "pending" }),
        },
        {
            name: "返信済み（見積もり）",
            value: statsData.respondedResponses || "0",
            change: "確認済み",
            changeType: "neutral",
            icon: "✅",
            link: route("admin.quote-response.index"),
        },
    ];

    const recentActivities = [
        { id: 1, user: "田中太郎", action: "新規登録", time: "5分前" },
        { id: 2, user: "佐藤花子", action: "プロフィール更新", time: "15分前" },
        { id: 3, user: "山田次郎", action: "ログイン", time: "30分前" },
        { id: 4, user: "鈴木三郎", action: "記事投稿", time: "1時間前" },
        { id: 5, user: "高橋四郎", action: "パスワード変更", time: "2時間前" },
    ];

    // ダミーログデータ
    const logs = {
        activity: [
            {
                id: 1,
                description: "ユーザー登録",
                performed_at: "2024-06-01 10:00",
                user_name: "田中太郎",
                ip_address: "192.168.1.1",
                status_name: "成功",
                status_color: "green",
            },
            {
                id: 2,
                description: "プロフィール更新",
                performed_at: "2024-06-01 09:50",
                user_name: "佐藤花子",
                ip_address: "192.168.1.2",
                status_name: "成功",
                status_color: "green",
            },
        ],
        event: [
            {
                id: 3,
                description: "パスワードリセット",
                performed_at: "2024-06-01 09:30",
                user_name: "山田次郎",
                ip_address: "192.168.1.3",
                status_name: "イベント",
                status_color: "blue",
            },
        ],
        warning: [
            {
                id: 4,
                description: "ログイン失敗",
                performed_at: "2024-06-01 09:20",
                user_name: "鈴木三郎",
                ip_address: "192.168.1.4",
                status_name: "警告",
                status_color: "yellow",
            },
        ],
    };
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
            <Head title="管理者ダッシュボード" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* ヘッダー */}
            <div className="w-full mx-auto space-y-6">
                {/* メインコンテンツ */}
                <div className="flex-1 space-y-6">
                    {/* 統計カード */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                onClick={() =>
                                    stat.link &&
                                    (window.location.href = stat.link)
                                }
                                className={stat.link ? "cursor-pointer" : ""}
                            >
                                <Card>
                                    <div
                                        className={`p-5 ${stat.link ? "hover:bg-gray-50 transition" : ""}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl">
                                                    {stat.icon}
                                                </span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                        {stat.name}
                                                    </dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                                            {stat.value}
                                                        </div>
                                                        <div
                                                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                                                                stat.changeType ===
                                                                "increase"
                                                                    ? "text-green-600"
                                                                    : stat.changeType ===
                                                                        "decrease"
                                                                      ? "text-red-600"
                                                                      : "text-gray-500 dark:text-gray-400"
                                                            }`}
                                                        >
                                                            {stat.change}
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* メインコンテンツグリッド */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 最近のアクティビティ */}
                        <Card>
                            <CardHeader>📋 最近のアクティビティ</CardHeader>
                            <CardBody>
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {recentActivities.map(
                                            (activity, activityIdx) => (
                                                <li key={activity.id}>
                                                    <div className="relative pb-8">
                                                        {activityIdx !==
                                                        recentActivities.length -
                                                            1 ? (
                                                            <span
                                                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                                aria-hidden="true"
                                                            />
                                                        ) : null}
                                                        <div className="relative flex space-x-3">
                                                            <div>
                                                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                                    <span className="text-white text-xs font-medium">
                                                                        {activity.user.charAt(
                                                                            0,
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                            {
                                                                                activity.user
                                                                            }
                                                                        </span>{" "}
                                                                        が{" "}
                                                                        {
                                                                            activity.action
                                                                        }{" "}
                                                                        を実行しました
                                                                    </p>
                                                                </div>
                                                                <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        activity.time
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>

                        {/* クイックアクション */}
                        <Card>
                            <CardHeader>⚡ クイックアクション</CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    {statsData.pendingResponses > 0 && (
                                        <Link
                                            href={route(
                                                "admin.quote-response.index",
                                                { status: "pending" },
                                            )}
                                            className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <span className="mr-2">⏳</span>
                                            {statsData.pendingResponses}{" "}
                                            件の返信を確認
                                        </Link>
                                    )}
                                    <Link
                                        href={route(
                                            "admin.quote-response.index",
                                        )}
                                        className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <span className="mr-2">📋</span>
                                        すべての返信を表示
                                    </Link>
                                    <button className="block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                                        <span className="mr-2">👤</span>
                                        ユーザー管理
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* システム情報 */}
                    <Card>
                        <CardHeader>🖥️ システム情報</CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        99.9%
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        稼働率
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        1.2GB
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        使用容量
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        v1.0.0
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        システムバージョン
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                {/* 右側サイドバーにログ表示 */}
                <SidebarLogs logs={logs} moreUrl="/admin/logs" />
            </div>
        </AdminAuthenticatedLayout>
    );
}
