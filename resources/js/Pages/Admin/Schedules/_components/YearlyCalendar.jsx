import { useMemo } from "react";
import { router } from "@inertiajs/react";

const todayStr = () => new Date().toISOString().split("T")[0];

export default function YearlyCalendar({ year, calendar, appointments = {} }) {
    const today = todayStr();
    // 12ヶ月分のカレンダーを生成
    const months = useMemo(() => {
        const monthsData = [];
        for (let month = 0; month < 12; month++) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDay = firstDay.getDay();
            const daysInMonth = lastDay.getDate();

            // カレンダーグリッドを生成
            const grid = [];

            // 前月の空白
            for (let i = 0; i < startDay; i++) {
                grid.push(null);
            }

            // 当月の日付
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayData = calendar[dateStr] || {
                    date: dateStr,
                    is_business_day: false,
                    is_holiday: false,
                    day_of_week: new Date(year, month, day).getDay(),
                };
                grid.push(dayData);
            }

            monthsData.push({
                month: month + 1,
                name: `${month + 1}月`,
                grid,
            });
        }
        return monthsData;
    }, [year, calendar]);

    const getDayCellStyle = (day) => {
        if (!day) return "text-gray-300 dark:text-gray-600 rounded";

        const classes = [];

        if (day.date === today) {
            classes.push(
                "bg-amber-400 text-white font-bold rounded-full",
            );
        } else if (day.is_holiday) {
            classes.push(
                "bg-red-100 text-red-800 font-semibold dark:bg-red-900/40 dark:text-red-300 rounded",
            );
        } else if (day.is_exception && !day.is_business_day) {
            classes.push(
                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded",
            );
        } else if (!day.is_business_day) {
            classes.push(
                "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded",
            );
        } else {
            classes.push("text-gray-700 dark:text-gray-300 rounded");
        }

        // 土日の色（今日は上書きしない）
        if (day.date !== today) {
            if (day.day_of_week === 0) {
                classes.push("text-red-600 dark:text-red-400");
            } else if (day.day_of_week === 6) {
                classes.push("text-blue-600 dark:text-blue-400");
            }
        }

        return classes.join(" ");
    };

    const handleMonthClick = (month) => {
        router.get(route("admin.schedules.index"), {
            year,
            month,
            view: "month",
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {months.map((monthData) => (
                <div
                    key={monthData.month}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleMonthClick(monthData.month)}
                >
                    {/* 月ヘッダー */}
                    <div className="text-center font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {monthData.name}
                    </div>

                    {/* 曜日ヘッダー */}
                    <div className="grid grid-cols-7 gap-px mb-1">
                        {["日", "月", "火", "水", "木", "金", "土"].map(
                            (day, index) => (
                                <div
                                    key={day}
                                    className={`text-center text-xs font-medium ${
                                        index === 0
                                            ? "text-red-600 dark:text-red-400"
                                            : index === 6
                                              ? "text-blue-600 dark:text-blue-400"
                                              : "text-gray-600 dark:text-gray-400"
                                    }`}
                                >
                                    {day}
                                </div>
                            ),
                        )}
                    </div>

                    {/* カレンダーグリッド */}
                    <div className="grid grid-cols-7 gap-px">
                        {monthData.grid.map((day, index) => {
                            const dayAppointmentCount = day
                                ? (appointments[day.date] || []).length
                                : 0;
                            return (
                                <div
                                    key={index}
                                    className={`relative text-center text-xs py-1 ${getDayCellStyle(day)}`}
                                    title={
                                        dayAppointmentCount > 0
                                            ? `予約 ${dayAppointmentCount}件`
                                            : undefined
                                    }
                                >
                                    {day ? new Date(day.date).getDate() : ""}
                                    {dayAppointmentCount > 0 && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
