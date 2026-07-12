import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const todayStr = () => new Date().toISOString().split("T")[0];

/**
 * 予約枠を月カレンダーから選択するコンポーネント。
 * 予約枠がある日をハイライトし、日付をクリックするとその日の時間帯一覧を表示する。
 */
export default function SlotCalendar({ slots = [], value, onChange }) {
    const today = todayStr();

    // 日付ごとに予約枠をグルーピング
    const slotsByDate = useMemo(() => {
        const map = {};
        slots.forEach((slot) => {
            if (!map[slot.date]) map[slot.date] = [];
            map[slot.date].push(slot);
        });
        return map;
    }, [slots]);

    const selectedSlot = useMemo(
        () => slots.find((s) => String(s.value) === String(value)),
        [slots, value],
    );

    const [visibleMonth, setVisibleMonth] = useState(() => {
        const base = selectedSlot ? new Date(selectedSlot.date) : new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const [selectedDate, setSelectedDate] = useState(
        selectedSlot?.date || null,
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
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            grid.push(dateStr);
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

    const dayTimeSlots = selectedDate ? slotsByDate[selectedDate] || [] : [];

    return (
        <div>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                {/* 月ナビゲーション */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700">
                    <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {visibleMonth.getFullYear()}年{" "}
                        {visibleMonth.getMonth() + 1}月
                    </span>
                    <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <ChevronRightIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1 bg-gray-50 dark:bg-gray-700">
                    {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                {/* 日付グリッド */}
                <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-600">
                    {calendarGrid.map((dateStr, index) => {
                        if (!dateStr) {
                            return (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 h-12"
                                />
                            );
                        }

                        const hasSlots = (slotsByDate[dateStr] || []).length > 0;
                        const isSelected = selectedDate === dateStr;
                        const isToday = dateStr === today;
                        const dayNumber = parseInt(
                            dateStr.split("-")[2],
                            10,
                        );

                        return (
                            <button
                                type="button"
                                key={dateStr}
                                disabled={!hasSlots}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`h-12 flex flex-col items-center justify-center text-sm transition-colors ${
                                    hasSlots
                                        ? "bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer"
                                        : "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                } ${isSelected ? "ring-2 ring-inset ring-indigo-500" : ""}`}
                            >
                                <span
                                    className={
                                        isToday
                                            ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-white font-bold"
                                            : ""
                                    }
                                >
                                    {dayNumber}
                                </span>
                                {hasSlots && (
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 mt-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 選択した日の時間帯一覧 */}
            {selectedDate && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {selectedDate} の予約可能な時間
                    </p>
                    {dayTimeSlots.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            この日は予約可能な時間帯がありません
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {dayTimeSlots.map((slot) => (
                                <button
                                    type="button"
                                    key={slot.value}
                                    onClick={() => onChange(slot.value)}
                                    className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                                        String(value) === String(slot.value)
                                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                            : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    <div className="font-medium">
                                        {slot.start_time?.substring(0, 5)} -{" "}
                                        {slot.end_time?.substring(0, 5)}
                                    </div>
                                    {slot.assigned_admin && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            担当: {slot.assigned_admin.name}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
