import React from "react";
import { ArrayFieldEditor, SelectInput, FormGroup } from "@/Components/Forms";

export const ICON_TEXT_DEFAULT_DATA = {
    columns: 3,
    items: [],
};

const ITEMS_SCHEMA = {
    icon: { type: "text", label: "アイコン（絵文字）", default: "" },
    title: { type: "text", label: "タイトル", default: "" },
    text: { type: "textarea", label: "説明文", default: "" },
};

const GRID_CLASSES = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
};

export default function IconTextBlock({ data, onChange }) {
    const value = { ...ICON_TEXT_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <FormGroup label="列数">
                <SelectInput
                    value={value.columns}
                    onChange={(e) =>
                        onChange({ ...value, columns: Number(e.target.value) })
                    }
                >
                    <option value={2}>2列</option>
                    <option value={3}>3列</option>
                    <option value={4}>4列</option>
                </SelectInput>
            </FormGroup>
            <ArrayFieldEditor
                value={value.items}
                onChange={(items) => onChange({ ...value, items })}
                itemsSchema={ITEMS_SCHEMA}
                label="項目"
            />
        </div>
    );
}

export function IconTextBlockPreview({ data }) {
    const value = { ...ICON_TEXT_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.title || item.text);
    if (items.length === 0) return null;
    const gridClass = GRID_CLASSES[value.columns] || GRID_CLASSES[3];

    return (
        <div className={`grid ${gridClass} gap-8`}>
            {items.map((item, i) => (
                <div key={i} className="text-center">
                    {item.icon && <div className="text-4xl mb-3">{item.icon}</div>}
                    {item.title && (
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    )}
                    {item.text && <p className="text-gray-600 text-sm">{item.text}</p>}
                </div>
            ))}
        </div>
    );
}
