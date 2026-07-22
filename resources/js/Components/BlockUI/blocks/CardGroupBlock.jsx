import React from "react";
import { ArrayFieldEditor, SelectInput, FormGroup } from "@/Components/Forms";

export const CARD_GROUP_DEFAULT_DATA = {
    columns: 3,
    items: [],
};

const ITEMS_SCHEMA = {
    icon: { type: "text", label: "アイコン（絵文字・任意）", default: "" },
    title: { type: "text", label: "タイトル", default: "" },
    text: { type: "textarea", label: "説明文", default: "" },
    linkLabel: { type: "text", label: "リンクラベル（任意）", default: "" },
    url: { type: "text", label: "リンク先URL（任意）", default: "" },
};

const GRID_CLASSES = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
};

export default function CardGroupBlock({ data, onChange }) {
    const value = { ...CARD_GROUP_DEFAULT_DATA, ...data };

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
                label="カード"
            />
        </div>
    );
}

export function CardGroupBlockPreview({ data }) {
    const value = { ...CARD_GROUP_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.title || item.text);
    if (items.length === 0) return null;
    const gridClass = GRID_CLASSES[value.columns] || GRID_CLASSES[3];

    return (
        <div className={`grid ${gridClass} gap-6`}>
            {items.map((item, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 bg-white"
                >
                    {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}
                    {item.title && (
                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    )}
                    {item.text && <p className="text-gray-600 text-sm">{item.text}</p>}
                    {item.linkLabel && item.url && (
                        <a
                            href={item.url}
                            className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 font-semibold hover:text-blue-700"
                        >
                            {item.linkLabel} →
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}
