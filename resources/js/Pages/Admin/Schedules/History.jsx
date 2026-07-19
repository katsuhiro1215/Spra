import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

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

export default function ScheduleHistory({ logs = [] }) {
    const [keyword, setKeyword] = useState("");

    const filteredLogs = keyword
        ? logs.filter((log) =>
              [
                  log.description,
                  log.route_name,
                  log.user_name,
                  log.ip_address,
              ]
                  .filter(Boolean)
                  .some((field) =>
                      field.toLowerCase().includes(keyword.toLowerCase()),
                  ),
          )
        : logs;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.scheduleHistory.title}
                    description={PageConfig.scheduleHistory.description}
                    breadcrumbs={PageConfig.scheduleHistory.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.scheduleHistory.documentTitle} />

            <FlashMessage />
            <div className="w-full flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
                <Card>
                    <div className="flex items-center gap-4 mb-4">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="内容・操作対象・ユーザー・IPで検索"
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <Th>日時</Th>
                                    <Th>内容</Th>
                                    <Th>操作対象</Th>
                                    <Th>ユーザー</Th>
                                    <Th>IP</Th>
                                    <Th>ステータス</Th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center text-gray-400 dark:text-gray-500 py-8"
                                        >
                                            変更履歴はありません
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id}>
                                            <Td>
                                                {formatDateTime(
                                                    log.performed_at,
                                                )}
                                            </Td>
                                            <Td className="text-gray-900 dark:text-gray-100">
                                                {log.description}
                                            </Td>
                                            <Td>{log.route_name || "-"}</Td>
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
                                                    {log.status_name}
                                                </span>
                                            </Td>
                                        </tr>
                                    ))
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
