import { useMemo } from "react";

export default function DailyCalendar({ selectedDate, calendar }) {
    // 選択された日のデータを取得
    const dayData = useMemo(() => {
        const dateStr = selectedDate.toISOString().split("T")[0];
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

    // 時間を分に変換
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    // 24時間分の時間スロット生成
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push({
                hour,
                label: `${hour.toString().padStart(2, "0")}:00`,
            });
        }
        return slots;
    }, []);

    // 時間が営業時間内かチェック
    const isBusinessHour = (hour) => {
        if (!dayData.is_business_day || !dayData.hours) return false;

        const openMinutes = timeToMinutes(dayData.hours.open_time);
        const closeMinutes = timeToMinutes(dayData.hours.close_time);
        const currentMinutes = hour * 60;
        const nextHourMinutes = (hour + 1) * 60;

        return (
            (currentMinutes >= openMinutes && currentMinutes < closeMinutes) ||
            (nextHourMinutes > openMinutes && nextHourMinutes <= closeMinutes)
        );
    };

    // 時間が休憩時間内かチェック
    const isBreakHour = (hour) => {
        if (
            !dayData.is_business_day ||
            !dayData.hours ||
            !dayData.hours.break_start
        )
            return false;

        const breakStartMinutes = timeToMinutes(dayData.hours.break_start);
        const breakEndMinutes = timeToMinutes(dayData.hours.break_end);
        const currentMinutes = hour * 60;
        const nextHourMinutes = (hour + 1) * 60;

        return (
            (currentMinutes >= breakStartMinutes &&
                currentMinutes < breakEndMinutes) ||
            (nextHourMinutes > breakStartMinutes &&
                nextHourMinutes <= breakEndMinutes)
        );
    };

    const getDayStatus = () => {
        if (dayData.is_holiday) return "休業日";
        if (dayData.is_business_day) return "営業日";
        return "定休日";
    };

    const getStatusColor = () => {
        if (dayData.is_holiday)
            return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
        if (dayData.is_business_day)
            return "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400";
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    };

    const getDayOfWeekColor = () => {
        if (dayData.day_of_week === 0) return "text-red-600 dark:text-red-400";
        if (dayData.day_of_week === 6)
            return "text-blue-600 dark:text-blue-400";
        return "text-gray-800 dark:text-gray-200";
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* 日付ヘッダー */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
                    <div className="text-5xl font-bold mb-2">
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
                    <div className="flex items-center justify-center">
                        <div
                            className={`px-6 py-2 rounded-full text-base font-semibold ${getStatusColor()}`}
                        >
                            {getDayStatus()}
                        </div>
                    </div>
                </div>

                {/* 時間軸カレンダー */}
                <div className="p-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {timeSlots.map((slot) => {
                            const isBusiness = isBusinessHour(slot.hour);
                            const isBreak = isBreakHour(slot.hour);

                            let bgColor = "bg-white dark:bg-gray-800";
                            if (isBusiness) {
                                bgColor = isBreak
                                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                                    : "bg-green-50 dark:bg-green-900/20";
                            }

                            return (
                                <div
                                    key={slot.hour}
                                    className={`flex items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${bgColor} transition-colors`}
                                >
                                    <div className="w-20 flex-shrink-0 py-3 px-4 font-mono text-sm font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                                        {slot.label}
                                    </div>
                                    <div className="flex-1 py-3 px-4">
                                        {isBusiness && (
                                            <div className="flex items-center">
                                                {isBreak ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                                        <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                                                            休憩時間
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                                                            営業中
                                                        </span>
                                                    </>
                                                )}
                                            </div>
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
                                    : "この日は定休日です"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
