import React, { useState } from "react";
import { ArrayFieldEditor } from "@/Components/Forms";

export const TABS_DEFAULT_DATA = {
    items: [],
};

const ITEMS_SCHEMA = {
    label: { type: "text", label: "タブ名", default: "" },
    content: { type: "textarea", label: "内容", default: "" },
};

export default function TabsBlock({ data, onChange }) {
    const value = { ...TABS_DEFAULT_DATA, ...data };

    return (
        <ArrayFieldEditor
            value={value.items}
            onChange={(items) => onChange({ ...value, items })}
            itemsSchema={ITEMS_SCHEMA}
            label="タブ"
        />
    );
}

export function TabsBlockPreview({ data }) {
    const value = { ...TABS_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.label);
    const [active, setActive] = useState(0);
    if (items.length === 0) return null;
    const activeIndex = Math.min(active, items.length - 1);

    return (
        <div>
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {items.map((item, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setActive(i)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            i === activeIndex
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            {items[activeIndex]?.content && (
                <div className="pt-4 text-gray-700 whitespace-pre-line">
                    {items[activeIndex].content}
                </div>
            )}
        </div>
    );
}
