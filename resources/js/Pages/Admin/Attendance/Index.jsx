import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import MonthlyAttendanceCalendar from "./_components/MonthlyAttendanceCalendar";
import {
    ClockIcon,
    Squares2X2Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function AttendanceIndex({
    calendar,
    workingNow = [],
    currentYear,
    currentMonth,
}) {
    const changeMonth = (offset) => {
        const newDate = new Date(currentYear, currentMonth - 1 + offset, 1);
        router.get(route("admin.attendance.index"), {
            year: newDate.getFullYear(),
            month: newDate.getMonth() + 1,
        });
    };

    const headerActions = [
        {
            label: "シフトをまとめて作成",
            icon: Squares2X2Icon,
            variant: "secondary",
            route: route("admin.attendance.shifts.bulk-create"),
        },
        {
            label: "シフト管理",
            icon: ClockIcon,
            variant: "secondary",
            route: route("admin.attendance.shifts.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.attendance.title}
                    description={PageConfig.attendance.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.attendance.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.attendance.documentTitle} />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4 lg:flex-row">
                {/* 現在出勤中 */}
                <div className="lg:w-72 flex-shrink-0">
                    <Card>
                        <CardHeader>現在出勤中（{workingNow.length}名）</CardHeader>
                        <CardBody>
                            {workingNow.length > 0 ? (
                                <ul className="space-y-3">
                                    {workingNow.map((entry) => (
                                        <li
                                            key={entry.admin_id}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                                {entry.admin_name}
                                                {entry.status ===
                                                    "on_break" && (
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                                                        休憩中
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {entry.clocked_in_at}〜
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    現在出勤中の管理者はいません
                                </p>
                            )}
                        </CardBody>
                    </Card>

                    <div className="mt-4">
                        <Card>
                            <CardBody>
                                <Link
                                    href={route(
                                        "admin.attendance.records.index",
                                    )}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    出退勤記録の修正はこちら
                                </Link>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* カレンダー */}
                <div className="flex-1">
                    <Card>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                                    前
                                </button>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {currentYear}年 {currentMonth}月
                                </h3>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    次
                                    <ChevronRightIcon className="w-5 h-5 ml-1" />
                                </button>
                            </div>

                            <MonthlyAttendanceCalendar
                                year={currentYear}
                                month={currentMonth}
                                calendar={calendar}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
