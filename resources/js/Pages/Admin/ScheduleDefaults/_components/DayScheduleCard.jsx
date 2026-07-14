import React from "react";
import ToggleSwitch from "./ToggleSwitch";
import TimeRangeInput from "./TimeRangeInput";
import { PageConfig } from "@/Constants/PageConfig";

/**
 * DayScheduleCard - 1日分のスケジュールカードコンポーネント
 * @param {object} schedule - スケジュールデータ
 * @param {number} dayIndex - 曜日のインデックス（0-6）
 * @param {function} onChange - 変更ハンドラー (field, value) => void
 */
const DayScheduleCard = ({ schedule, dayIndex, onChange }) => {
    return (
        <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
            {/* トグルスイッチと曜日表示 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <ToggleSwitch
                        checked={schedule.is_open}
                        onChange={(e) => onChange("is_open", e.target.checked)}
                        label={`${PageConfig.defaults.dayNames[dayIndex]}曜日`}
                    />
                </div>
                {schedule.is_open ? (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded">
                        営業日
                    </span>
                ) : (
                    <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                        {PageConfig.defaults.labels.closedDay}
                    </span>
                )}
            </div>

            {/* 営業時間と休憩時間（営業日のみ表示） */}
            {schedule.is_open && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 営業時間 */}
                    <TimeRangeInput
                        label={PageConfig.defaults.labels.businessHours}
                        startValue={schedule.open_time}
                        endValue={schedule.close_time}
                        onStartChange={(e) =>
                            onChange("open_time", e.target.value)
                        }
                        onEndChange={(e) =>
                            onChange("close_time", e.target.value)
                        }
                    />

                    {/* 休憩時間 */}
                    <TimeRangeInput
                        label={PageConfig.defaults.labels.breakTime}
                        startValue={schedule.break_start}
                        endValue={schedule.break_end}
                        onStartChange={(e) =>
                            onChange("break_start", e.target.value)
                        }
                        onEndChange={(e) =>
                            onChange("break_end", e.target.value)
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default DayScheduleCard;
