import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import { Head } from "@inertiajs/react";
import SidebarLogs from "./Admin/Logs/SidebarLogs";

export default function Dashboard() {
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
            name: "アクティブユーザー",
            value: "567",
            change: "+3.1%",
            changeType: "increase",
            icon: "✨",
        },
        {
            name: "システムステータス",
            value: "正常",
            change: "稼働中",
            changeType: "neutral",
            icon: "🟢",
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

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        📊 管理者ダッシュボード
                    </h2>
                    <div className="flex items-center gap-4">
                        <a
                            href="/admin/logs"
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                        >
                            ログ一覧を見る
                        </a>
                        <span className="text-sm text-gray-500">
                            最終更新: {new Date().toLocaleString("ja-JP")}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="管理者ダッシュボード" />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            <div className="flex gap-6">
                {/* メインコンテンツ */}
                <div className="flex-1 space-y-6">
                    {/* 統計カード */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                className="bg-white overflow-hidden shadow-sm rounded-lg"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="text-2xl">
                                                {stat.icon}
                                            </span>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {stat.name}
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">
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
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {stat.change}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* メインコンテンツグリッド */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 最近のアクティビティ */}
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    📋 最近のアクティビティ
                                </h3>
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
                                                                            0
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">
                                                                        <span className="font-medium text-gray-900">
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
                                                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                    {
                                                                        activity.time
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* クイックアクション */}
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    ⚡ クイックアクション
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="mr-2">👤</span>
                                        ユーザー管理
                                    </button>
                                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <span className="mr-2">📝</span>
                                        コンテンツ作成
                                    </button>
                                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                        <span className="mr-2">📊</span>
                                        レポート表示
                                    </button>
                                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                        <span className="mr-2">⚙️</span>
                                        システム設定
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* システム情報 */}
                    <div className="bg-white shadow-sm rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                🖥️ システム情報
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        99.9%
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        稼働率
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        1.2GB
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        使用容量
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        v1.0.0
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        システムバージョン
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 右側サイドバーにログ表示 */}
                <SidebarLogs logs={logs} moreUrl="/admin/logs" />
            </div>
        </AdminAuthenticatedLayout>
    );
}
