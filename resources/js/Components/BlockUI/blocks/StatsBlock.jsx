import React from "react";
import { ArrayFieldEditor } from "@/Components/Forms";

export const STATS_DEFAULT_DATA = {
    items: [],
};

const ITEMS_SCHEMA = {
    value: { type: "text", label: "数値", default: "" },
    label: { type: "text", label: "ラベル", default: "" },
};

export default function StatsBlock({ data, onChange }) {
    const value = { ...STATS_DEFAULT_DATA, ...data };

    return (
        <ArrayFieldEditor
            value={value.items}
            onChange={(items) => onChange({ ...value, items })}
            itemsSchema={ITEMS_SCHEMA}
            label="数値"
        />
    );
}

const GRID_CLASSES = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
};

export function StatsBlockPreview({ data }) {
    const value = { ...STATS_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.value || item.label);
    if (items.length === 0) return null;
    const gridClass = GRID_CLASSES[Math.min(items.length, 4)] || GRID_CLASSES[4];

    return (
        <div className={`grid ${gridClass} gap-8 text-center`}>
            {items.map((item, i) => (
                <div key={i}>
                    <div className="text-4xl font-bold text-blue-600">{item.value}</div>
                    <div className="mt-2 text-gray-600">{item.label}</div>
                </div>
            ))}
        </div>
    );
}
