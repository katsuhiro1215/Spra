import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { todayDateKey } from "@/Utils/dateUtils";

const statusChipClasses = {
    yellow: "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-200",
    blue: "bg-blue-200 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200",
    green: "bg-green-200 text-green-900 dark:bg-green-900/60 dark:text-green-200",
    red: "bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-200",
    gray: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200",
};

export default function MonthlyCalendar({
    year,
    month,
    calendar,
    appointments = {},
}) {
    const today = todayDateKey();
    // 月表示用のカレンダーグリッドを生成
    const monthCalendarGrid = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const grid = [];

        // 前月の空白
        for (let i = 0; i < startDay; i++) {
            grid.push(null);
        }

        // 当月の日付
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayData = calendar[dateStr] || {
                date: dateStr,
                is_business_day: false,
                is_holiday: false,
                hours: null,
                day_of_week: new Date(year, month - 1, day).getDay(),
            };
            grid.push(dayData);
        }

        // 週の最後まで埋める
        while (grid.length % 7 !== 0) {
            grid.push(null);
        }

        return grid;
    }, [year, month, calendar]);

    const getDayCellStyle = (day) => {
        if (!day)
            return "border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900";

        const classes = ["border", "p-2", "min-h-24", "relative"];

        if (day.is_holiday) {
            classes.push(
                "bg-red-50",
                "border-red-200",
                "dark:bg-red-900/30",
                "dark:border-red-800",
            );
        } else if (day.is_exception && !day.is_business_day) {
            classes.push(
                "bg-amber-50",
                "border-amber-200",
                "dark:bg-amber-900/20",
                "dark:border-amber-800",
            );
        } else if (!day.is_business_day) {
            classes.push(
                "bg-gray-100",
                "border-gray-200",
                "dark:bg-gray-700",
                "dark:border-gray-600",
            );
        } else {
            classes.push(
                "bg-white",
                "border-gray-200",
                "dark:bg-gray-800",
                "dark:border-gray-700",
            );
        }

        // 土日の背景色
        if (day.day_of_week === 0) {
            classes.push("text-red-600", "dark:text-red-400");
        } else if (day.day_of_week === 6) {
            classes.push("text-blue-600", "dark:text-blue-400");
        } else {
            classes.push("text-gray-900", "dark:text-gray-100");
        }

        return classes.join(" ");
    };

    return (
        <div>
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-0 mb-2">
                {["日", "月", "火", "水", "木", "金", "土"].map(
                    (day, index) => (
                        <div
                            key={day}
                            className={`text-center font-semibold py-2 ${
                                index === 0
                                    ? "text-red-600 dark:text-red-400"
                                    : index === 6
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            {day}
                        </div>
                    ),
                )}
            </div>

            {/* カレンダーグリッド */}
            <div className="grid grid-cols-7 gap-0">
                {monthCalendarGrid.map((day, index) => (
                    <div key={index} className={getDayCellStyle(day)}>
                        {day && (
                            <>
                                <div className="mb-1">
                                    <span
                                        className={
                                            day.date === today
                                                ? "inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-lg font-bold"
                                                : "text-lg font-semibold"
                                        }
                                    >
                                        {new Date(day.date).getDate()}
                                    </span>
                                </div>
                                {day.is_holiday && (
                                    <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                                        {day.holiday_name || "休業日"}
                                    </div>
                                )}
                                {day.is_exception && (
                                    <div
                                        className={`text-xs font-medium mb-1 ${
                                            day.is_business_day
                                                ? "text-amber-700 dark:text-amber-400"
                                                : "text-amber-700 dark:text-amber-400"
                                        }`}
                                        title={day.exception_reason || ""}
                                    >
                                        {day.exception_reason ||
                                            (day.is_business_day
                                                ? "臨時営業"
                                                : "臨時休業")}
                                    </div>
                                )}
                                {day.hours && day.hours.open_time && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        営業: {day.hours.open_time} -{" "}
                                        {day.hours.close_time}
                                    </div>
                                )}
                                {day.hours && day.hours.break_start && (
                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                        休憩: {day.hours.break_start}-
                                        {day.hours.break_end}
                                    </div>
                                )}
                                {(appointments[day.date] || []).length > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                        {appointments[day.date].map(
                                            (appointment) => (
                                                <Link
                                                    key={appointment.id}
                                                    href={route(
                                                        "admin.appointments.show",
                                                        appointment.id,
                                                    )}
                                                    className={`block truncate rounded px-1 py-0.5 text-[10px] font-medium ${statusChipClasses[appointment.status_color] || statusChipClasses.gray}`}
                                                    title={`${appointment.start_time?.substring(0, 5)} ${appointment.subject} (${appointment.booker_name})`}
                                                >
                                                    {appointment.start_time?.substring(
                                                        0,
                                                        5,
                                                    )}{" "}
                                                    {appointment.booker_name}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
