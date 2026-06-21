import { useMemo } from "react";

export default function MonthlyCalendar({ year, month, calendar }) {
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
        if (!day) return "border border-gray-100 bg-gray-50";

        const classes = ["border", "p-2", "min-h-24", "relative"];

        if (day.is_holiday) {
            classes.push("bg-red-50", "border-red-200");
        } else if (!day.is_business_day) {
            classes.push("bg-gray-100", "border-gray-200");
        } else {
            classes.push("bg-white", "border-gray-200");
        }

        // 土日の背景色
        if (day.day_of_week === 0) {
            classes.push("text-red-600");
        } else if (day.day_of_week === 6) {
            classes.push("text-blue-600");
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
                                    ? "text-red-600"
                                    : index === 6
                                      ? "text-blue-600"
                                      : "text-gray-700"
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
                                <div className="text-lg font-semibold mb-1">
                                    {new Date(day.date).getDate()}
                                </div>
                                {day.is_holiday && (
                                    <div className="text-xs text-red-600 font-medium mb-1">
                                        休業日
                                    </div>
                                )}
                                {day.hours && day.hours.open_time && (
                                    <div className="text-xs text-gray-600">
                                        {day.hours.open_time} -{" "}
                                        {day.hours.close_time}
                                    </div>
                                )}
                                {day.hours && day.hours.break_start && (
                                    <div className="text-xs text-gray-500">
                                        休憩: {day.hours.break_start}-
                                        {day.hours.break_end}
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
