import { useMemo } from "react";

// 行の高さを統一
const ROW_HEIGHT = 36;

export default function GanttTimeline({
    viewMode = "month",
    startDate,
    endDate,
}) {
    // タイムラインの期間を生成
    const timelineData = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const periods = [];

        if (viewMode === "day") {
            // 日単位
            let current = new Date(start);
            while (current <= end) {
                periods.push({
                    date: new Date(current),
                    label: current.getDate(),
                    subLabel: `${current.getMonth() + 1}月`,
                });
                current.setDate(current.getDate() + 1);
            }
        } else if (viewMode === "week") {
            // 週単位
            let current = new Date(start);
            let weekNum = 1;
            while (current <= end) {
                periods.push({
                    date: new Date(current),
                    label: `W${weekNum}`,
                    subLabel: `${current.getMonth() + 1}月`,
                });
                current.setDate(current.getDate() + 7);
                weekNum++;
            }
        } else if (viewMode === "month") {
            // 月単位
            let current = new Date(start);
            while (current <= end) {
                periods.push({
                    date: new Date(current),
                    label: `${current.getMonth() + 1}月`,
                    subLabel: `${current.getFullYear()}年`,
                });
                current.setMonth(current.getMonth() + 1);
            }
        } else if (viewMode === "quarter") {
            // 四半期単位
            let current = new Date(start);
            while (current <= end) {
                const quarter = Math.floor(current.getMonth() / 3) + 1;
                periods.push({
                    date: new Date(current),
                    label: `Q${quarter}`,
                    subLabel: `${current.getFullYear()}年`,
                });
                current.setMonth(current.getMonth() + 3);
            }
        }

        return periods;
    }, [viewMode, startDate, endDate]);

    // セルの幅を決定
    const cellWidth = useMemo(() => {
        switch (viewMode) {
            case "day":
                return 60;
            case "week":
                return 80;
            case "month":
                return 100;
            case "quarter":
                return 120;
            default:
                return 100;
        }
    }, [viewMode]);

    return (
        <div
            className="bg-gray-50 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700 overflow-x-auto"
            style={{ height: `${ROW_HEIGHT}px` }}
        >
            <div className="flex h-full" style={{ minWidth: "100%" }}>
                {timelineData.map((period, index) => (
                    <div
                        key={index}
                        className="border-r border-gray-300 dark:border-slate-700 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-slate-800"
                        style={{ width: `${cellWidth}px` }}
                    >
                        <div className="text-center">
                            <div className="text-xs font-semibold text-gray-900 dark:text-slate-100">
                                {period.label}
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-slate-400">
                                {period.subLabel}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
