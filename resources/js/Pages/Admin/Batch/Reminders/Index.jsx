import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { PageConfig } from "@/Constants/PageConfig";

const STATUS_BADGE_CLASSES = {
    pending:
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    sent: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
};

const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

const formatDateHeader = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return `${month}/${day}(${dayNames[date.getDay()]})`;
};

export default function ReminderExecutionIndex({
    rows = [],
    dates = [],
    filters = {},
}) {
    const [from, setFrom] = useState(filters.from || "");
    const [to, setTo] = useState(filters.to || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.batch.reminders.index"),
            { from, to },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.batchReminders.title}
                    description={PageConfig.batchReminders.description}
                    breadcrumbs={PageConfig.batchReminders.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.batchReminders.documentTitle} />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 期間フィルター */}
                <Card>
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-wrap items-end gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                開始日
                            </label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                終了日
                            </label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            表示
                        </button>

                        {/* 凡例 */}
                        <div className="ml-auto flex items-center gap-3 text-xs">
                            <span
                                className={`px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE_CLASSES.pending}`}
                            >
                                実行前
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE_CLASSES.sent}`}
                            >
                                正常終了
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE_CLASSES.failed}`}
                            >
                                異常終了
                            </span>
                        </div>
                    </form>
                </Card>

                {/* クライアント×日付マトリクス */}
                <Card>
                    {rows.length === 0 || dates.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            指定した期間にリマインダー対象の予約がありません
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            クライアント
                                        </th>
                                        {dates.map((date) => (
                                            <th
                                                key={date}
                                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {formatDateHeader(date)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {rows.map((row) => (
                                        <tr
                                            key={row.client_key}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {row.client_name}
                                                {row.is_guest && (
                                                    <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                                                        (一般)
                                                    </span>
                                                )}
                                            </td>
                                            {dates.map((date) => {
                                                const cell =
                                                    row.cells[date];
                                                return (
                                                    <td
                                                        key={date}
                                                        className="px-3 py-3 text-center"
                                                    >
                                                        {cell ? (
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    STATUS_BADGE_CLASSES[
                                                                        cell
                                                                            .status
                                                                    ] ||
                                                                    STATUS_BADGE_CLASSES.pending
                                                                }`}
                                                                title={
                                                                    cell.status ===
                                                                    "failed"
                                                                        ? cell.error ||
                                                                          ""
                                                                        : `${cell.time} ${cell.subject}`
                                                                }
                                                            >
                                                                {
                                                                    cell.status_label
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300 dark:text-gray-600">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
