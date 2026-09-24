import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Show({ report, activityLogs }) {
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`AI社員 日報 - ${report.report_date}`}
                    description={
                        report.admin?.department ?? report.admin?.email
                    }
                    breadcrumbs={["AI社員 日報", report.report_date]}
                    actions={[
                        {
                            label: "一覧に戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route(
                                "admin.ai-staff-daily-reports.index",
                            ),
                        },
                    ]}
                />
            }
        >
            <Head title={`AI社員 日報 - ${report.report_date}`} />

            <div className="space-y-4">
                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            日報本文
                        </h3>
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans">
                            {report.body}
                        </pre>
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            活動ログ（{activityLogs.length}件）
                        </h3>
                        <ul className="space-y-2">
                            {activityLogs.map((log) => (
                                <li
                                    key={log.id}
                                    className="text-sm text-gray-700 dark:text-gray-300 border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                                >
                                    <span className="text-gray-400 dark:text-gray-500 mr-2">
                                        {new Date(
                                            log.occurred_at,
                                        ).toLocaleTimeString("ja-JP", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    {log.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
