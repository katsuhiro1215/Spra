import { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import DailyCalendar from "./_components/DailyCalendar";
import WeeklyCalendar from "./_components/WeeklyCalendar";
import MonthlyCalendar from "./_components/MonthlyCalendar";
import YearlyCalendar from "./_components/YearlyCalendar";
// Icons
import {
    PlusIcon,
    CalendarDaysIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CalendarIcon,
    UserGroupIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function ScheduleIndex({
    auth,
    calendar,
    holidays,
    currentYear,
    currentMonth,
    viewMode: initialViewMode = "month",
}) {
    const [viewMode, setViewMode] = useState(initialViewMode); // 'year', 'month', 'week', 'day'
    const [selectedDate, setSelectedDate] = useState(
        new Date(currentYear, currentMonth - 1, 1),
    );

    // カレンダーデータを配列に変換
    const calendarArray = useMemo(() => {
        return Object.values(calendar);
    }, [calendar]);

    // 年を変更
    const changeYear = (offset) => {
        const newYear = currentYear + offset;
        router.get(route("admin.schedules.index"), {
            year: newYear,
            month: currentMonth,
            view: "year",
        });
    };

    // 月を変更
    const changeMonth = (offset) => {
        const newDate = new Date(currentYear, currentMonth - 1 + offset, 1);
        router.get(route("admin.schedules.index"), {
            year: newDate.getFullYear(),
            month: newDate.getMonth() + 1,
            view: "month",
        });
    };

    // 週を変更
    const changeWeek = (offset) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + offset * 7);
        setSelectedDate(newDate);
    };

    // 日を変更
    const changeDay = (offset) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + offset);
        setSelectedDate(newDate);
    };

    // ビューモードを変更
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    // ナビゲーション情報を取得
    const getNavigationInfo = () => {
        switch (viewMode) {
            case "year":
                return {
                    label: `${currentYear}年`,
                    prev: () => changeYear(-1),
                    next: () => changeYear(1),
                };
            case "month":
                return {
                    label: `${currentYear}年 ${currentMonth}月`,
                    prev: () => changeMonth(-1),
                    next: () => changeMonth(1),
                };
            case "week":
                return {
                    label: `${selectedDate.getFullYear()}年 ${selectedDate.getMonth() + 1}月 第${Math.ceil(selectedDate.getDate() / 7)}週`,
                    prev: () => changeWeek(-1),
                    next: () => changeWeek(1),
                };
            case "day":
                return {
                    label: `${selectedDate.getFullYear()}年 ${selectedDate.getMonth() + 1}月 ${selectedDate.getDate()}日`,
                    prev: () => changeDay(-1),
                    next: () => changeDay(1),
                };
            default:
                return { label: "", prev: () => {}, next: () => {} };
        }
    };

    const navigationInfo = getNavigationInfo();

    // サイドバーメニュー
    const sidebarLinks = [
        {
            href: route("admin.schedules.defaults.index"),
            icon: ClockIcon,
            label: "営業時間設定",
            description: "曜日ごとのデフォルト営業時間",
        },
        {
            href: route("admin.schedules.exceptions.index"),
            icon: ExclamationTriangleIcon,
            label: "例外日設定",
            description: "特定日の営業時間",
        },
        {
            href: route("admin.schedules.holidays.index"),
            icon: CalendarIcon,
            label: "祝日管理",
            description: "祝日や特別休業日",
        },
        {
            href: route("admin.appointment-slots.index"),
            icon: UserGroupIcon,
            label: "予約枠管理",
            description: "クライアント面談・相談枠",
        },
    ];

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <PageHeader
                    title="スケジュール管理"
                    description="スケジュールの作成、編集、削除を行います"
                    breadcrumbs={PageConfig.schedules.breadcrumbs}
                />
            }
        >
            <Head title="スケジュールカレンダー" />

            <div className="w-full flex flex-col gap-4">
                <div className="flex gap-6">
                    {/* 左サイドバー */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                                設定メニュー
                            </h3>
                            <nav className="space-y-2">
                                {sidebarLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors group"
                                    >
                                        <div className="flex items-start">
                                            <link.icon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mt-0.5 mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                    {link.label}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {link.description}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* メインコンテンツ */}
                    <div className="flex-1 space-y-6">
                        {/* ビューモード切り替えとナビゲーション */}
                        <Card>
                            <div className="space-y-6">
                                {/* ナビゲーション */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={navigationInfo.prev}
                                        className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                                        前
                                    </button>

                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {navigationInfo.label}
                                    </h3>

                                    <button
                                        onClick={navigationInfo.next}
                                        className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        次
                                        <ChevronRightIcon className="w-5 h-5 ml-1" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    {/* 凡例 */}
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            凡例
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mr-2 rounded"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    営業日
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 mr-2 rounded"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    定休日
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 mr-2 rounded"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    祝日・休業日
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ビューモード切り替えボタン */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleViewModeChange("year")
                                                }
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    viewMode === "year"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                            >
                                                年
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleViewModeChange(
                                                        "month",
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    viewMode === "month"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                            >
                                                月
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleViewModeChange("week")
                                                }
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    viewMode === "week"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                            >
                                                週
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleViewModeChange("day")
                                                }
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    viewMode === "day"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                            >
                                                日
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* カレンダー表示 */}
                                {viewMode === "year" && (
                                    <YearlyCalendar
                                        year={currentYear}
                                        calendar={calendar}
                                    />
                                )}
                                {viewMode === "month" && (
                                    <MonthlyCalendar
                                        year={currentYear}
                                        month={currentMonth}
                                        calendar={calendar}
                                    />
                                )}
                                {viewMode === "week" && (
                                    <WeeklyCalendar
                                        selectedDate={selectedDate}
                                        calendar={calendar}
                                    />
                                )}
                                {viewMode === "day" && (
                                    <DailyCalendar
                                        selectedDate={selectedDate}
                                        calendar={calendar}
                                    />
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
