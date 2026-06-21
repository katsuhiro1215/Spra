import { useMemo } from "react";

export default function WeeklyCalendar({ selectedDate, calendar }) {
    // 週表示用のデータを生成
    const weekCalendarData = useMemo(() => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

        const week = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = date.toISOString().split("T")[0];
            const dayData = calendar[dateStr] || {
                date: dateStr,
                is_business_day: false,
                is_holiday: false,
                hours: null,
                day_of_week: date.getDay(),
                day_name: ["日", "月", "火", "水", "木", "金", "土"][
                    date.getDay()
                ],
            };
            week.push(dayData);
        }
        return week;
    }, [selectedDate, calendar]);

    const getDayCellStyle = (day) => {
        if (!day) return "";

        const classes = ["border", "p-3", "min-h-32", "relative"];

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

            {/* 週カレンダーグリッド */}
            <div className="grid grid-cols-7 gap-0">
                {weekCalendarData.map((day, index) => (
                    <div key={index} className={getDayCellStyle(day)}>
                        <div className="text-lg font-semibold mb-2">
                            {new Date(day.date).getDate()}
                        </div>
                        {day.is_holiday && (
                            <div className="text-xs text-red-600 font-medium mb-1">
                                休業日
                            </div>
                        )}
                        {day.hours && day.hours.open_time && (
                            <div className="text-sm text-gray-700 mb-2">
                                <div className="font-medium">営業時間</div>
                                <div>
                                    {day.hours.open_time} -{" "}
                                    {day.hours.close_time}
                                </div>
                            </div>
                        )}
                        {day.hours && day.hours.break_start && (
                            <div className="text-sm text-gray-600">
                                <div className="font-medium">休憩時間</div>
                                <div>
                                    {day.hours.break_start} -{" "}
                                    {day.hours.break_end}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
