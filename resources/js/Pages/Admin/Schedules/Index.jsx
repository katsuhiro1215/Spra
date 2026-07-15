import { useState, useMemo } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import DailyCalendar from "./_components/DailyCalendar";
import WeeklyCalendar from "./_components/WeeklyCalendar";
import MonthlyCalendar from "./_components/MonthlyCalendar";
import YearlyCalendar from "./_components/YearlyCalendar";
import AppointmentSlotQuickCreateModal from "@/Components/Schedules/AppointmentSlotQuickCreateModal";
import { formatDateKey } from "@/Utils/dateUtils";
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
    appointments = {},
    appointmentSlots = {},
    admins = [],
    currentYear,
    currentMonth,
    viewMode: initialViewMode = "month",
    selectedDate: initialSelectedDate,
}) {
    const [viewMode, setViewMode] = useState(initialViewMode); // 'year', 'month', 'week', 'day'
    const [selectedDate, setSelectedDate] = useState(
        initialSelectedDate
            ? new Date(`${initialSelectedDate}T00:00:00`)
            : new Date(currentYear, currentMonth - 1, 1),
    );

    // カレンダーからの予約枠クイック作成
    const [quickCreateOpen, setQuickCreateOpen] = useState(false);
    const {
        data: slotData,
        setData: setSlotData,
        post: postSlot,
        processing: slotProcessing,
        errors: slotErrors,
        reset: resetSlotForm,
        clearErrors: clearSlotErrors,
    } = useForm({
        date: "",
        start_time: "",
        end_time: "",
        slot_type: "meeting",
        max_capacity: 1,
        assigned_admin_id: "",
        status: "available",
        notes: "",
    });

    const openQuickCreate = (date, startTime, endTime) => {
        clearSlotErrors();
        setSlotData({
            date,
            start_time: startTime,
            end_time: endTime,
            slot_type: "meeting",
            max_capacity: 1,
            assigned_admin_id: "",
            status: "available",
            notes: "",
        });
        setQuickCreateOpen(true);
    };

    const closeQuickCreate = () => {
        setQuickCreateOpen(false);
        resetSlotForm();
    };

    const submitQuickCreate = (e) => {
        e.preventDefault();
        postSlot(route("admin.appointment-slots.quick-store"), {
            preserveScroll: true,
            onSuccess: () => {
                setQuickCreateOpen(false);
                resetSlotForm();
            },
        });
    };

    // 表示中のビュー・日付をURLへ反映（再読み込み後も同じ画面に戻れるようにする）
    // 週・日ビューで月をまたいだ場合もカレンダーデータの月がズレないよう、年月はdateから導出する
    const syncViewState = (mode, date) => {
        router.get(
            route("admin.schedules.index"),
            {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                view: mode,
                date: formatDateKey(date),
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

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
        syncViewState(viewMode, newDate);
    };

    // 日を変更
    const changeDay = (offset) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + offset);
        setSelectedDate(newDate);
        syncViewState(viewMode, newDate);
    };

    // ビューモードを変更
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        syncViewState(mode, selectedDate);
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

    // サイドバーメニューの色分け（営業時間=緑、例外=黄、祝日=赤、予約枠=青）
    const sidebarColorClasses = {
        green: {
            iconWrap: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
            hover: "hover:bg-green-50 dark:hover:bg-green-900/20",
            label: "group-hover:text-green-700 dark:group-hover:text-green-400",
        },
        yellow: {
            iconWrap: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
            hover: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
            label: "group-hover:text-yellow-700 dark:group-hover:text-yellow-400",
        },
        red: {
            iconWrap: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
            hover: "hover:bg-red-50 dark:hover:bg-red-900/20",
            label: "group-hover:text-red-700 dark:group-hover:text-red-400",
        },
        blue: {
            iconWrap: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
            hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
            label: "group-hover:text-blue-700 dark:group-hover:text-blue-400",
        },
    };

    // サイドバーメニュー
    const sidebarLinks = [
        {
            href: route("admin.schedules.defaults.index"),
            icon: ClockIcon,
            label: "営業時間設定",
            description: "曜日ごとのデフォルト営業時間",
            color: "green",
        },
        {
            href: route("admin.schedules.exceptions.index"),
            icon: ExclamationTriangleIcon,
            label: "例外日設定",
            description: "特定日の営業時間",
            color: "yellow",
        },
        {
            href: route("admin.schedules.holidays.index"),
            icon: CalendarIcon,
            label: "祝日管理",
            description: "祝日や特別休業日",
            color: "red",
        },
        {
            href: route("admin.appointment-slots.index"),
            icon: UserGroupIcon,
            label: "予約枠管理",
            description: "クライアント面談・相談枠",
            color: "blue",
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
            <FlashMessage />

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
                                {sidebarLinks.map((link) => {
                                    const colors =
                                        sidebarColorClasses[link.color];
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block p-3 rounded-lg transition-colors group ${colors.hover}`}
                                        >
                                            <div className="flex items-start">
                                                <span
                                                    className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg mr-3 ${colors.iconWrap}`}
                                                >
                                                    <link.icon className="h-5 w-5" />
                                                </span>
                                                <div>
                                                    <div
                                                        className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${colors.label}`}
                                                    >
                                                        {link.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {link.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
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
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mr-2 rounded"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    例外日（理由つき）
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-amber-400 mr-2 rounded-full"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    今日
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
                                        appointments={appointments}
                                    />
                                )}
                                {viewMode === "month" && (
                                    <MonthlyCalendar
                                        year={currentYear}
                                        month={currentMonth}
                                        calendar={calendar}
                                        appointments={appointments}
                                    />
                                )}
                                {viewMode === "week" && (
                                    <WeeklyCalendar
                                        selectedDate={selectedDate}
                                        calendar={calendar}
                                        appointments={appointments}
                                    />
                                )}
                                {viewMode === "day" && (
                                    <DailyCalendar
                                        selectedDate={selectedDate}
                                        calendar={calendar}
                                        appointments={appointments}
                                        appointmentSlots={appointmentSlots}
                                        onCellClick={openQuickCreate}
                                    />
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <AppointmentSlotQuickCreateModal
                show={quickCreateOpen}
                data={slotData}
                setData={setSlotData}
                errors={slotErrors}
                processing={slotProcessing}
                onSubmit={submitQuickCreate}
                onClose={closeQuickCreate}
                admins={admins}
            />
        </AdminAuthenticatedLayout>
    );
}
