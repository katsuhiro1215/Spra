import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import {
    ClockIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const TABS = [
    {
        key: "activity",
        label: "操作ログ",
        icon: <ClockIcon className="h-5 w-5" />,
    },
    {
        key: "warning",
        label: "警告",
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    },
    {
        key: "event",
        label: "イベント",
        icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
        key: "login",
        label: "ログイン履歴",
        icon: <ClockIcon className="h-5 w-5 text-green-500" />,
    },
];

const STATUS_BADGE_CLASSES = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const statusBadgeClass = (color) =>
    STATUS_BADGE_CLASSES[color] || STATUS_BADGE_CLASSES.gray;

const formatDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("ja-JP");
};

export default function AdminLogsIndex({ logs = {}, filters = {} }) {
    const [activeTab, setActiveTab] = useState("activity");
    const [keyword, setKeyword] = useState("");
    const tabLogs = logs[activeTab] || [];

    const filteredLogs = keyword
        ? tabLogs.filter((log) =>
              [
                  log.description,
                  log.action_name,
                  log.user_name,
                  log.ip_address,
              ]
                  .filter(Boolean)
                  .some((field) =>
                      field.toLowerCase().includes(keyword.toLowerCase()),
                  ),
          )
        : tabLogs;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.logs.title}
                    description={PageConfig.logs.description}
                    breadcrumbs={PageConfig.logs.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.logs.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <div className="w-full flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                                    activeTab === tab.key
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                                <span className="ml-1 text-xs opacity-70">
                                    {(logs[tab.key] || []).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <Card>
                    <div className="flex items-center gap-4 mb-4">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="キーワード・ユーザー名・IPで検索"
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                {activeTab === "login" ? (
                                    <tr>
                                        <Th>日時</Th>
                                        <Th>ユーザー</Th>
                                        <Th>IP</Th>
                                        <Th>デバイス</Th>
                                        <Th>種別</Th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <Th>日時</Th>
                                        <Th>内容</Th>
                                        <Th>ユーザー</Th>
                                        <Th>IP</Th>
                                        <Th>ステータス</Th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center text-gray-400 dark:text-gray-500 py-8"
                                        >
                                            ログはありません
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) =>
                                        activeTab === "login" ? (
                                            <tr key={log.id}>
                                                <Td>
                                                    {formatDateTime(
                                                        log.logged_in_at ||
                                                            log.logged_out_at,
                                                    )}
                                                </Td>
                                                <Td>{log.user_name || "-"}</Td>
                                                <Td>{log.ip_address || "-"}</Td>
                                                <Td>
                                                    {log.device_name || "-"}
                                                    {log.browser
                                                        ? ` / ${log.browser}`
                                                        : ""}
                                                </Td>
                                                <Td>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs ${statusBadgeClass(
                                                            log.status_color,
                                                        )}`}
                                                    >
                                                        {log.type_name}
                                                    </span>
                                                    {log.formatted_duration && (
                                                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                                                            (
                                                            {
                                                                log.formatted_duration
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </Td>
                                            </tr>
                                        ) : (
                                            <tr key={log.id}>
                                                <Td>
                                                    {formatDateTime(
                                                        log.performed_at,
                                                    )}
                                                </Td>
                                                <Td className="text-gray-900 dark:text-gray-100">
                                                    {log.description ||
                                                        log.action_name}
                                                </Td>
                                                <Td>
                                                    {log.actor_type ===
                                                        "admin" && (
                                                        <span className="mr-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                            Admin
                                                        </span>
                                                    )}
                                                    {log.user_name || "-"}
                                                </Td>
                                                <Td>{log.ip_address || "-"}</Td>
                                                <Td>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs ${statusBadgeClass(
                                                            log.status_color,
                                                        )}`}
                                                    >
                                                        {log.status_name ||
                                                            log.action_name}
                                                    </span>
                                                </Td>
                                            </tr>
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}

function Th({ children }) {
    return (
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            {children}
        </th>
    );
}

function Td({ children, className = "" }) {
    return (
        <td
            className={`px-4 py-2 text-xs text-gray-700 dark:text-gray-300 ${className}`}
        >
            {children}
        </td>
    );
}
