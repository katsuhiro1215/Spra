import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";

export default function Index({ reports, filters, aiStaffAdmins }) {
    const handleFilterChange = (key, value) => {
        router.get(
            route("admin.ai-staff-daily-reports.index"),
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="AI社員 日報"
                    description="AI社員の日々の活動を日付・担当者別に確認できます"
                    breadcrumbs={["AI社員 日報"]}
                />
            }
        >
            <Head title="AI社員 日報" />

            <div className="space-y-4">
                <Card>
                    <div className="flex flex-wrap gap-3 p-4">
                        <select
                            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2"
                            value={filters.admin_id || ""}
                            onChange={(e) =>
                                handleFilterChange("admin_id", e.target.value)
                            }
                        >
                            <option value="">全AI社員</option>
                            {aiStaffAdmins.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.department ?? admin.email}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2"
                            value={filters.report_date || ""}
                            onChange={(e) =>
                                handleFilterChange(
                                    "report_date",
                                    e.target.value,
                                )
                            }
                        />
                    </div>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        日付
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        AI社員
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        活動件数
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {reports.data.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {report.report_date}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {report.admin?.department ??
                                                report.admin?.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">
                                                {report.activity_count}件
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route(
                                                    "admin.ai-staff-daily-reports.show",
                                                    report.id,
                                                )}
                                                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {reports.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            該当する日報がありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {reports.data.length > 0 && (
                    <Pagination paginationData={reports} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
