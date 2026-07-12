import React from "react";
import { CHART_COLORS } from "./LineChart";

const formatDefault = (v) => new Intl.NumberFormat("ja-JP").format(Math.round(v));

/**
 * 軽量な横棒チャート（ランキング表示・単一色で統一）
 *
 * @param {Array<{label: string, value: number}>} data
 */
export default function BarChart({
    data = [],
    color = CHART_COLORS.blue.light,
    formatValue = formatDefault,
    emptyLabel = "データがありません",
}) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-sm text-slate-400 dark:text-slate-500">
                {emptyLabel}
            </div>
        );
    }

    const maxValue = Math.max(1, ...data.map((d) => d.value));

    return (
        <div className="space-y-2.5">
            {data.map((d) => {
                const widthPct = Math.max(2, (d.value / maxValue) * 100);
                return (
                    <div key={d.label} className="group">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span
                                className="text-slate-600 dark:text-slate-300 truncate max-w-[70%]"
                                title={d.label}
                            >
                                {d.label}
                            </span>
                            <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                                {formatValue(d.value)}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${widthPct}%`, backgroundColor: color }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
