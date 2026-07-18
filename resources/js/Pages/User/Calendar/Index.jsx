import { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import Badge from "@/Components/Badge";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    VideoCameraIcon,
    MapPinIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

const statusVariants = {
    pending: "warning",
    confirmed: "info",
    completed: "success",
    cancelled: "danger",
    no_show: "secondary",
};

const statusLabels = {
    pending: "保留中",
    confirmed: "確定",
    completed: "完了",
    cancelled: "キャンセル",
    no_show: "不参加",
};

const todayStr = () => new Date().toISOString().split("T")[0];

const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];

export default function Index({ appointments }) {
    const today = todayStr();

    const events = useMemo(
        () =>
            appointments
                .filter((appointment) => appointment.appointment_slot)
                .map((appointment) => ({
                    ...appointment,
                    date: appointment.appointment_slot.date,
                })),
        [appointments],
    );

    const eventsByDate = useMemo(() => {
        const map = {};
        events.forEach((event) => {
            if (!map[event.date]) map[event.date] = [];
            map[event.date].push(event);
        });
        return map;
    }, [events]);

    const [visibleMonth, setVisibleMonth] = useState(() => {
        const base = new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const [selectedDate, setSelectedDate] = useState(
        eventsByDate[today] ? today : null,
    );

    const calendarGrid = useMemo(() => {
        const year = visibleMonth.getFullYear();
        const month = visibleMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const grid = [];
        for (let i = 0; i < startDay; i++) grid.push(null);
        for (let day = 1; day <= daysInMonth; day++) {
            grid.push(
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
            );
        }
        return grid;
    }, [visibleMonth]);

    const changeMonth = (offset) => {
        setVisibleMonth(
            new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth() + offset,
                1,
            ),
        );
    };

    const formatTime = (time) => (time ? time.substring(0, 5) : "");

    const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "カレンダー", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="カレンダー"
                    description="ご自身の予約状況をカレンダーで確認できます"
                    breadcrumbs={breadcrumbs}
                    actions={[
                        {
                            label: "新しく予約する",
                            route: route("user.appointments.create"),
                        },
                    ]}
                />
            }
        >
            <Head title="カレンダー" />

            <FlashMessage />

            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8 space-y-4">
                <div className="flex justify-end md:hidden">
                    <Link href={route("user.appointments.create")}>
                        <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            新しく予約する
                        </span>
                    </Link>
                </div>

                <Card>
                    <CardBody>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* 月ナビゲーション */}
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => changeMonth(-1)}
                                    className="p-1 rounded hover:bg-gray-200"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                                </button>
                                <span className="text-base font-semibold text-gray-900">
                                    {visibleMonth.getFullYear()}年{" "}
                                    {visibleMonth.getMonth() + 1}月
                                </span>
                                <button
                                    type="button"
                                    onClick={() => changeMonth(1)}
                                    className="p-1 rounded hover:bg-gray-200"
                                >
                                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>

                            {/* 曜日ヘッダー */}
                            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 py-1 bg-gray-50">
                                {weekdayLabels.map((d) => (
                                    <div key={d}>{d}</div>
                                ))}
                            </div>

                            {/* 日付グリッド */}
                            <div className="grid grid-cols-7 gap-px bg-gray-100">
                                {calendarGrid.map((dateStr, index) => {
                                    if (!dateStr) {
                                        return (
                                            <div
                                                key={index}
                                                className="bg-white h-16"
                                            />
                                        );
                                    }

                                    const dayEvents =
                                        eventsByDate[dateStr] || [];
                                    const hasEvents = dayEvents.length > 0;
                                    const isSelected =
                                        selectedDate === dateStr;
                                    const isToday = dateStr === today;
                                    const dayNumber = parseInt(
                                        dateStr.split("-")[2],
                                        10,
                                    );

                                    return (
                                        <button
                                            type="button"
                                            key={dateStr}
                                            onClick={() =>
                                                setSelectedDate(
                                                    isSelected
                                                        ? null
                                                        : dateStr,
                                                )
                                            }
                                            className={`h-16 flex flex-col items-center justify-center text-sm transition-colors bg-white hover:bg-indigo-50 ${
                                                isSelected
                                                    ? "ring-2 ring-inset ring-indigo-500"
                                                    : ""
                                            }`}
                                        >
                                            <span
                                                className={
                                                    isToday
                                                        ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-white font-bold"
                                                        : "text-gray-700"
                                                }
                                            >
                                                {dayNumber}
                                            </span>
                                            {hasEvents && (
                                                <span className="flex gap-0.5 mt-1">
                                                    {dayEvents
                                                        .slice(0, 3)
                                                        .map((event) => (
                                                            <span
                                                                key={event.id}
                                                                className={`w-1.5 h-1.5 rounded-full ${
                                                                    event.status ===
                                                                    "cancelled"
                                                                        ? "bg-gray-300"
                                                                        : "bg-indigo-500"
                                                                }`}
                                                            />
                                                        ))}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 選択した日の予約一覧 */}
                {selectedDate && (
                    <Card>
                        <CardBody>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                {selectedDate} の予約
                            </h3>

                            {selectedEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-500 mb-3">
                                        この日の予約はありません
                                    </p>
                                    <Link
                                        href={route(
                                            "user.appointments.create",
                                        )}
                                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        この日に予約する
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedEvents.map((event) => (
                                        <Link
                                            key={event.id}
                                            href={route(
                                                "user.appointments.index",
                                            )}
                                            className="block border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-gray-900">
                                                    {formatTime(
                                                        event
                                                            .appointment_slot
                                                            .start_time,
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        event
                                                            .appointment_slot
                                                            .end_time,
                                                    )}
                                                </span>
                                                <Badge
                                                    variant={
                                                        statusVariants[
                                                            event.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        statusLabels[
                                                            event.status
                                                        ]
                                                    }
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {event.subject}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                {event.location_type ===
                                                "online" ? (
                                                    <VideoCameraIcon className="h-4 w-4" />
                                                ) : (
                                                    <MapPinIcon className="h-4 w-4" />
                                                )}
                                                {event.location_type ===
                                                "online"
                                                    ? "オンライン"
                                                    : "対面"}
                                                {event.project && (
                                                    <span className="ml-2">
                                                        プロジェクト:{" "}
                                                        {event.project.title}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
