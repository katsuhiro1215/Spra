import React, { useMemo, useState } from "react";

// カテゴリカルパレット（CVD検証済み・固定順で割り当てる）
export const CHART_COLORS = {
    blue: { light: "#2a78d6", dark: "#3987e5" },
    aqua: { light: "#1baf7a", dark: "#199e70" },
    yellow: { light: "#eda100", dark: "#c98500" },
    green: { light: "#008300", dark: "#008300" },
    violet: { light: "#4a3aa7", dark: "#9085e9" },
    red: { light: "#e34948", dark: "#e66767" },
};

const WIDTH = 800;
const HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 28, left: 44 };

const formatDefault = (v) => new Intl.NumberFormat("ja-JP").format(Math.round(v));

/**
 * 軽量な折れ線チャート（複数系列・ホバーツールチップ対応）
 *
 * @param {Array<{date: string, [key: string]: number}>} data
 * @param {Array<{key: string, label: string, color: string}>} series
 */
export default function LineChart({
    data = [],
    series = [],
    formatValue = formatDefault,
    formatDate = (d) => d,
    height = HEIGHT,
}) {
    const [hoverIndex, setHoverIndex] = useState(null);

    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = height - PADDING.top - PADDING.bottom;

    const maxValue = useMemo(() => {
        const values = data.flatMap((d) => series.map((s) => d[s.key] || 0));
        const max = Math.max(1, ...values);
        // 上に少し余白を持たせる
        return max * 1.15;
    }, [data, series]);

    const xFor = (index) =>
        data.length <= 1
            ? PADDING.left + innerWidth / 2
            : PADDING.left + (innerWidth * index) / (data.length - 1);

    const yFor = (value) => PADDING.top + innerHeight - (innerHeight * value) / maxValue;

    const linePath = (key) =>
        data
            .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d[key] || 0)}`)
            .join(" ");

    const yTicks = 4;
    const gridValues = Array.from({ length: yTicks + 1 }, (_, i) => (maxValue / yTicks) * i);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-sm text-slate-400 dark:text-slate-500">
                データがありません
            </div>
        );
    }

    const hovered = hoverIndex !== null ? data[hoverIndex] : null;

    return (
        <div>
            {series.length > 1 && (
                <div className="flex flex-wrap gap-4 mb-2 px-1">
                    {series.map((s) => (
                        <div key={s.key} className="flex items-center gap-1.5">
                            <span
                                className="inline-block w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: s.color }}
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative">
                <svg
                    viewBox={`0 0 ${WIDTH} ${height}`}
                    className="w-full"
                    style={{ height: "auto" }}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    {/* グリッド線 */}
                    {gridValues.map((v, i) => (
                        <g key={i}>
                            <line
                                x1={PADDING.left}
                                x2={WIDTH - PADDING.right}
                                y1={yFor(v)}
                                y2={yFor(v)}
                                className="stroke-slate-200 dark:stroke-slate-700"
                                strokeWidth={1}
                            />
                            <text
                                x={PADDING.left - 8}
                                y={yFor(v)}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className="fill-slate-400 dark:fill-slate-500 text-[10px]"
                            >
                                {formatValue(v)}
                            </text>
                        </g>
                    ))}

                    {/* ベースライン */}
                    <line
                        x1={PADDING.left}
                        x2={WIDTH - PADDING.right}
                        y1={PADDING.top + innerHeight}
                        y2={PADDING.top + innerHeight}
                        className="stroke-slate-300 dark:stroke-slate-600"
                        strokeWidth={1}
                    />

                    {/* 系列ライン */}
                    {series.map((s) => (
                        <path
                            key={s.key}
                            d={linePath(s.key)}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}

                    {/* ホバー: クロスヘア＋マーカー */}
                    {hoverIndex !== null && (
                        <>
                            <line
                                x1={xFor(hoverIndex)}
                                x2={xFor(hoverIndex)}
                                y1={PADDING.top}
                                y2={PADDING.top + innerHeight}
                                className="stroke-slate-300 dark:stroke-slate-600"
                                strokeWidth={1}
                                strokeDasharray="3,3"
                            />
                            {series.map((s) => (
                                <circle
                                    key={s.key}
                                    cx={xFor(hoverIndex)}
                                    cy={yFor(data[hoverIndex][s.key] || 0)}
                                    r={4}
                                    fill={s.color}
                                    className="stroke-white dark:stroke-slate-900"
                                    strokeWidth={2}
                                />
                            ))}
                        </>
                    )}

                    {/* ホバー検出用の透明レイヤー */}
                    {data.map((d, i) => (
                        <rect
                            key={d.date}
                            x={PADDING.left + (innerWidth * i) / data.length}
                            y={PADDING.top}
                            width={innerWidth / data.length}
                            height={innerHeight}
                            fill="transparent"
                            onMouseEnter={() => setHoverIndex(i)}
                        />
                    ))}

                    {/* X軸ラベル（先頭・末尾のみ表示して過密を避ける） */}
                    <text
                        x={xFor(0)}
                        y={height - 6}
                        textAnchor="start"
                        className="fill-slate-400 dark:fill-slate-500 text-[10px]"
                    >
                        {formatDate(data[0].date)}
                    </text>
                    <text
                        x={xFor(data.length - 1)}
                        y={height - 6}
                        textAnchor="end"
                        className="fill-slate-400 dark:fill-slate-500 text-[10px]"
                    >
                        {formatDate(data[data.length - 1].date)}
                    </text>
                </svg>

                {hovered && (
                    <div
                        className="absolute top-0 pointer-events-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg px-3 py-2 text-xs"
                        style={{
                            left: `${(xFor(hoverIndex) / WIDTH) * 100}%`,
                            transform:
                                hoverIndex > data.length / 2
                                    ? "translateX(-100%)"
                                    : "translateX(0)",
                        }}
                    >
                        <div className="font-medium text-slate-700 dark:text-slate-200 mb-1">
                            {formatDate(hovered.date)}
                        </div>
                        {series.map((s) => (
                            <div
                                key={s.key}
                                className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300"
                            >
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                    />
                                    {s.label}
                                </span>
                                <span className="font-medium tabular-nums">
                                    {formatValue(hovered[s.key] || 0)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
