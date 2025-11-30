import { Head } from "@inertiajs/react";
import {
    ChartBarIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    CurrencyYenIcon,
} from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard() {
    // ダッシュボード用のモックデータ
    const dashboardStats = [
        {
            name: "進行中プロジェクト",
            value: "3",
            change: "+1",
            changeType: "increase",
            icon: DocumentTextIcon,
            color: "bg-blue-500",
        },
        {
            name: "完了プロジェクト",
            value: "12",
            change: "+2",
            changeType: "increase",
            icon: CheckCircleIcon,
            color: "bg-green-500",
        },
        {
            name: "今月の請求額",
            value: "¥450,000",
            change: "+12%",
            changeType: "increase",
            icon: CurrencyYenIcon,
            color: "bg-yellow-500",
        },
        {
            name: "平均完了日数",
            value: "28日",
            change: "-3日",
            changeType: "decrease",
            icon: ClockIcon,
            color: "bg-purple-500",
        },
    ];

    const recentProjects = [
        {
            id: 1,
            name: "ECサイトリニューアル",
            status: "進行中",
            progress: 75,
            dueDate: "2024-12-15",
            statusColor: "text-blue-600 bg-blue-100",
        },
        {
            id: 2,
            name: "管理システム開発",
            status: "レビュー中",
            progress: 90,
            dueDate: "2024-12-01",
            statusColor: "text-orange-600 bg-orange-100",
        },
        {
            id: 3,
            name: "モバイルアプリ開発",
            status: "進行中",
            progress: 45,
            dueDate: "2024-12-30",
            statusColor: "text-blue-600 bg-blue-100",
        },
    ];

    const notifications = [
        {
            id: 1,
            type: "success",
            title: "プロジェクトが完了しました",
            message: "「ECサイトリニューアル」が予定より早く完了しました。",
            time: "2時間前",
        },
        {
            id: 2,
            type: "warning",
            title: "請求書の確認が必要です",
            message: "11月分の請求書をご確認ください。",
            time: "1日前",
        },
        {
            id: 3,
            type: "info",
            title: "新しい機能が追加されました",
            message: "プロジェクト進捗の可視化機能が利用可能になりました。",
            time: "3日前",
        },
    ];

    return (
        <AuthenticatedLayout header="ダッシュボード">
            <Head title="ダッシュボード | Smart Sprouts" />

            <div className="space-y-6">
                {/* 統計カード */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {dashboardStats.map((stat) => (
                        <div
                            key={stat.name}
                            className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`${stat.color} p-3 rounded-md`}
                                        >
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
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
                                                            : "text-red-600"
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* プロジェクト一覧 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    最近のプロジェクト
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {project.name}
                                                    </h4>
                                                    <span
                                                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.statusColor}`}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                                    完了予定: {project.dueDate}
                                                </div>
                                                <div className="mt-2">
                                                    <div className="flex items-center">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${project.progress}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="ml-2 text-xs font-medium text-gray-900">
                                                            {project.progress}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-3 bg-gray-50 text-center">
                                <button className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
                                    すべてのプロジェクトを見る →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 通知・お知らせ */}
                    <div className="space-y-6">
                        {/* 通知 */}
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    通知
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="px-6 py-4"
                                    >
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                {notification.type ===
                                                    "success" && (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                )}
                                                {notification.type ===
                                                    "warning" && (
                                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                                                )}
                                                {notification.type ===
                                                    "info" && (
                                                    <ChartBarIcon className="h-5 w-5 text-blue-500" />
                                                )}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notification.title}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {notification.message}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* クイックアクション */}
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    クイックアクション
                                </h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                    新しいプロジェクトを開始
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                    請求書を確認
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                    サポートに連絡
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
