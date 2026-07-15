import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { formatDateKey, todayDateKey } from "@/Utils/dateUtils";

const statusChipClasses = {
    yellow: "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-200",
    blue: "bg-blue-200 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200",
    green: "bg-green-200 text-green-900 dark:bg-green-900/60 dark:text-green-200",
    red: "bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-200",
    gray: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200",
};

const slotStatusChipClasses = {
    available:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200",
    blocked:
        "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200",
    full: "bg-purple-200 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200",
};

// 時間を分に変換
const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

const minutesToLabel = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// 既定の面談時間（分）。クリック時にこの長さの枠を提案する。
const DEFAULT_SLOT_DURATION = 50;

export default function DailyCalendar({
    selectedDate,
    calendar,
    appointments = {},
    appointmentSlots = {},
    onCellClick,
}) {
    // 選択された日のデータを取得
    const dayData = useMemo(() => {
        const dateStr = formatDateKey(selectedDate);
        return (
            calendar[dateStr] || {
                date: dateStr,
                is_business_day: false,
                is_holiday: false,
                hours: null,
                day_of_week: selectedDate.getDay(),
                day_name: ["日", "月", "火", "水", "木", "金", "土"][
                    selectedDate.getDay()
                ],
            }
        );
    }, [selectedDate, calendar]);

    const dayAppointments = appointments[dayData.date] || [];
    const daySlots = appointmentSlots[dayData.date] || [];

    // 30分単位の時間スロット生成（00:00〜23:30）
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
            slots.push({
                minutes,
                label: minutesToLabel(minutes),
            });
        }
        return slots;
    }, []);

    // 指定した30分区間が営業時間内かチェック
    const isBusinessHalfHour = (startMinutes) => {
        if (!dayData.is_business_day || !dayData.hours) return false;

        const openMinutes = timeToMinutes(dayData.hours.open_time);
        const closeMinutes = timeToMinutes(dayData.hours.close_time);
        const endMinutes = startMinutes + 30;

        return startMinutes >= openMinutes && endMinutes <= closeMinutes;
    };

    // 指定した30分区間が休憩時間内かチェック
    const isBreakHalfHour = (startMinutes) => {
        if (
            !dayData.is_business_day ||
            !dayData.hours ||
            !dayData.hours.break_start
        )
            return false;

        const breakStartMinutes = timeToMinutes(dayData.hours.break_start);
        const breakEndMinutes = timeToMinutes(dayData.hours.break_end);
        const endMinutes = startMinutes + 30;

        return startMinutes < breakEndMinutes && endMinutes > breakStartMinutes;
    };

    const isToday = formatDateKey(selectedDate) === todayDateKey();

    const getDayStatus = () => {
        if (dayData.is_holiday) return dayData.holiday_name || "休業日";
        if (dayData.is_exception) {
            return dayData.is_business_day ? "臨時営業" : "臨時休業";
        }
        if (dayData.is_business_day) return "営業日";
        return "定休日";
    };

    const getStatusColor = () => {
        if (dayData.is_holiday)
            return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
        if (dayData.is_exception)
            return "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400";
        if (dayData.is_business_day)
            return "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400";
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    };

    const handleCellClick = (startMinutes) => {
        if (!onCellClick) return;

        const closeMinutes = dayData.hours?.close_time
            ? timeToMinutes(dayData.hours.close_time)
            : startMinutes + DEFAULT_SLOT_DURATION;
        const endMinutes = Math.min(
            startMinutes + DEFAULT_SLOT_DURATION,
            closeMinutes,
        );

        onCellClick(
            dayData.date,
            minutesToLabel(startMinutes),
            minutesToLabel(endMinutes),
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* 日付ヘッダー */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
                    <div className="text-5xl font-bold mb-2 relative inline-block">
                        {isToday && (
                            <span className="absolute -top-3 -right-6 px-2 py-0.5 rounded-full bg-amber-400 text-white text-xs font-bold">
                                今日
                            </span>
                        )}
                        {selectedDate.getDate()}
                    </div>
                    <div className="text-xl font-medium">
                        {selectedDate.getFullYear()}年{" "}
                        {selectedDate.getMonth() + 1}月
                    </div>
                    <div className={`text-lg font-medium mt-2`}>
                        {dayData.day_name}曜日
                    </div>
                </div>

                {/* 営業ステータス */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div
                            className={`px-6 py-2 rounded-full text-base font-semibold ${getStatusColor()}`}
                        >
                            {getDayStatus()}
                        </div>
                        {dayData.is_exception && dayData.exception_reason && (
                            <div className="text-sm text-amber-700 dark:text-amber-400">
                                {dayData.exception_reason}
                            </div>
                        )}
                    </div>
                </div>

                {/* 時間軸カレンダー */}
                <div className="p-6">
                    {onCellClick && dayData.is_business_day && (
                        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                            営業時間内の空いている時間帯にカーソルを合わせてクリックすると、予約枠を追加できます。
                        </p>
                    )}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {timeSlots.map((slot) => {
                            const isBusiness = isBusinessHalfHour(
                                slot.minutes,
                            );
                            const isBreak = isBreakHalfHour(slot.minutes);
                            const isHourStart = slot.minutes % 60 === 0;
                            const slotEndMinutes = slot.minutes + 30;

                            const hourAppointments = dayAppointments.filter(
                                (appointment) => {
                                    const start = timeToMinutes(
                                        appointment.start_time?.substring(
                                            0,
                                            5,
                                        ),
                                    );
                                    return (
                                        start >= slot.minutes &&
                                        start < slotEndMinutes
                                    );
                                },
                            );

                            const hourSlots = daySlots.filter((s) => {
                                const start = timeToMinutes(
                                    s.start_time?.substring(0, 5),
                                );
                                return (
                                    start >= slot.minutes &&
                                    start < slotEndMinutes
                                );
                            });

                            const isClickable =
                                !!onCellClick && isBusiness && !isBreak;

                            let bgColor = "bg-white dark:bg-gray-800";
                            if (isBusiness) {
                                bgColor = isBreak
                                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                                    : "bg-green-50 dark:bg-green-900/20";
                            }

                            return (
                                <div
                                    key={slot.minutes}
                                    onClick={
                                        isClickable
                                            ? () =>
                                                  handleCellClick(
                                                      slot.minutes,
                                                  )
                                            : undefined
                                    }
                                    className={`group flex items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${bgColor} transition-colors ${
                                        isHourStart
                                            ? ""
                                            : "border-t border-dashed border-gray-100 dark:border-gray-700/50"
                                    } ${
                                        isClickable
                                            ? "cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`w-20 flex-shrink-0 py-2 px-4 font-mono text-sm border-r border-gray-200 dark:border-gray-700 ${
                                            isHourStart
                                                ? "font-medium text-gray-600 dark:text-gray-400"
                                                : "text-gray-400 dark:text-gray-500"
                                        }`}
                                    >
                                        {slot.label}
                                    </div>
                                    <div className="flex-1 py-2 px-4 space-y-1">
                                        {hourSlots.map((s) => (
                                            <Link
                                                key={s.id}
                                                href={route(
                                                    "admin.appointment-slots.show",
                                                    s.id,
                                                )}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className={`block truncate rounded px-2 py-1 text-xs font-medium ${
                                                    slotStatusChipClasses[
                                                        s.status
                                                    ] ||
                                                    slotStatusChipClasses.available
                                                }`}
                                            >
                                                {s.start_time?.substring(
                                                    0,
                                                    5,
                                                )}
                                                -
                                                {s.end_time?.substring(0, 5)}{" "}
                                                {s.slot_type_label}
                                                {s.assigned_admin_name
                                                    ? `（${s.assigned_admin_name}）`
                                                    : ""}
                                                （{s.current_bookings}/
                                                {s.max_capacity}）
                                            </Link>
                                        ))}
                                        {hourAppointments.map(
                                            (appointment) => (
                                                <Link
                                                    key={appointment.id}
                                                    href={route(
                                                        "admin.appointments.show",
                                                        appointment.id,
                                                    )}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className={`block truncate rounded px-2 py-1 text-xs font-medium ${statusChipClasses[appointment.status_color] || statusChipClasses.gray}`}
                                                >
                                                    {appointment.start_time?.substring(
                                                        0,
                                                        5,
                                                    )}{" "}
                                                    {appointment.subject} (
                                                    {appointment.booker_name}
                                                    {appointment.is_guest_booking
                                                        ? "・一般"
                                                        : ""}
                                                    )
                                                </Link>
                                            ),
                                        )}
                                        {isClickable &&
                                            hourSlots.length === 0 &&
                                            hourAppointments.length === 0 && (
                                                <span className="hidden group-hover:inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-300">
                                                    ＋ 予約枠を追加
                                                </span>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 営業時間サマリー */}
                    {dayData.is_business_day && dayData.hours && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                営業時間サマリー
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        営業時間:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {dayData.hours.open_time} -{" "}
                                        {dayData.hours.close_time}
                                    </span>
                                </div>
                                {dayData.hours.break_start && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            休憩時間:
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {dayData.hours.break_start} -{" "}
                                            {dayData.hours.break_end}
                                        </span>
                                    </div>
                                )}
                                {dayData.hours.notes && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                                            メモ:
                                        </div>
                                        <div className="text-gray-900 dark:text-gray-100">
                                            {dayData.hours.notes}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!dayData.is_business_day && (
                        <div className="mt-6 text-center py-8 text-gray-500 dark:text-gray-400">
                            <div className="text-6xl mb-4">📅</div>
                            <div className="text-lg">
                                {dayData.is_holiday
                                    ? "この日は休業日です"
                                    : dayData.is_exception
                                      ? "この日は臨時休業です"
                                      : "この日は定休日です"}
                            </div>
                            {dayData.is_exception &&
                                dayData.exception_reason && (
                                    <div className="text-sm mt-2">
                                        {dayData.exception_reason}
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
