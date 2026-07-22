import { useMemo } from "react";
import { todayDateKey } from "@/Utils/dateUtils";

const statusChipClasses = {
    working: "bg-green-200 text-green-900 dark:bg-green-900/60 dark:text-green-200",
    finished: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200",
};

export default function MonthlyAttendanceCalendar({ year, month, calendar }) {
    const today = todayDateKey();

    // 月表示用のカレンダーグリッドを生成
    const monthCalendarGrid = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const grid = [];

        for (let i = 0; i < startDay; i++) {
            grid.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            grid.push(
                calendar[dateStr] || {
                    date: dateStr,
                    shifts: [],
                    records: [],
                },
            );
        }

        while (grid.length % 7 !== 0) {
            grid.push(null);
        }

        return grid;
    }, [year, month, calendar]);

    return (
        <div>
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

            <div className="grid grid-cols-7 gap-0">
                {monthCalendarGrid.map((day, index) => (
                    <div
                        key={index}
                        className={
                            day
                                ? "border p-2 min-h-24 relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                : "border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                        }
                    >
                        {day && (
                            <>
                                <div className="mb-1">
                                    <span
                                        className={
                                            day.date === today
                                                ? "inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-white text-lg font-bold"
                                                : "text-lg font-semibold text-gray-900 dark:text-gray-100"
                                        }
                                    >
                                        {new Date(day.date).getDate()}
                                    </span>
                                </div>

                                {day.shifts.length > 0 && (
                                    <div className="space-y-0.5 mb-1">
                                        {day.shifts.map((shift) => (
                                            <div
                                                key={shift.id}
                                                className="truncate text-[10px] text-indigo-700 dark:text-indigo-300"
                                                title={`${shift.admin_name} ${shift.start_time?.substring(0, 5)}-${shift.end_time?.substring(0, 5)}`}
                                            >
                                                予定: {shift.admin_name}{" "}
                                                {shift.start_time?.substring(
                                                    0,
                                                    5,
                                                )}
                                                -
                                                {shift.end_time?.substring(
                                                    0,
                                                    5,
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {day.records.length > 0 && (
                                    <div className="space-y-0.5">
                                        {day.records.map((record) => (
                                            <div
                                                key={record.id}
                                                className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                                                    statusChipClasses[
                                                        record.status
                                                    ] || statusChipClasses.finished
                                                }`}
                                                title={`${record.admin_name} ${record.clocked_in_at || ""}〜${record.clocked_out_at || ""} (${record.status_label})`}
                                            >
                                                {record.admin_name}{" "}
                                                {record.clocked_in_at || "-"}〜
                                                {record.clocked_out_at || ""}
                                            </div>
                                        ))}
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
