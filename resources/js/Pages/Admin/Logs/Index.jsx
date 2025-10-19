import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ClockIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const TABS = [
    {
        key: "activity",
        label: "操作ログ",
        icon: <ClockIcon className="h-5 w-5" />,
    },
    {
        key: "event",
        label: "イベント",
        icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
        key: "warning",
        label: "警告",
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    },
    {
        key: "login",
        label: "ログイン履歴",
        icon: <ClockIcon className="h-5 w-5 text-green-500" />,
    },
];

export default function AdminLogsIndex({ logs = {}, filters = {} }) {
    const [activeTab, setActiveTab] = useState("activity");
    const tabLogs = logs[activeTab] || [];

    return (
        <AdminLayout>
            <Head title="管理ログ一覧" />
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        管理ログ
                    </h1>
                    <div className="flex gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                                    activeTab === tab.key
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="キーワード・ユーザー名・IPで検索"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {/* TODO: 検索・フィルタ機能実装 */}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {activeTab === "login" ? (
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            日時
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            ユーザー
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            IP
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            デバイス
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            種別
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            詳細
                                        </th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            日時
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            内容
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            ユーザー
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            IP
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            ステータス
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                            詳細
                                        </th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {tabLogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center text-gray-400 py-8"
                                        >
                                            ログはありません
                                        </td>
                                    </tr>
                                ) : (
                                    tabLogs.map((log) =>
                                        activeTab === "login" ? (
                                            <tr key={log.id}>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.logged_in_at ||
                                                        log.logged_out_at}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.user_name}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.ip_address}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.device_name ||
                                                        log.device_type}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.event_type ||
                                                        log.type_name}
                                                </td>
                                                <td className="px-4 py-2 text-xs">
                                                    <Link
                                                        href={`/admin/logs/login/${log.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        詳細
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={log.id}>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.performed_at ||
                                                        log.logged_in_at}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {log.description ||
                                                        log.action_name ||
                                                        log.type_name}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.user_name}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-700">
                                                    {log.ip_address}
                                                </td>
                                                <td className="px-4 py-2 text-xs">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full ${
                                                            log.status_color
                                                                ? `bg-${log.status_color}-100 text-${log.status_color}-700`
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}
                                                    >
                                                        {log.status_name ||
                                                            log.status ||
                                                            log.type_name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-xs">
                                                    <Link
                                                        href={`/admin/logs/${log.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        詳細
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
