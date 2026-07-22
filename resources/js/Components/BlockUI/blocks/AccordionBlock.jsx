import React from "react";
import { ArrayFieldEditor } from "@/Components/Forms";

export const ACCORDION_DEFAULT_DATA = {
    items: [],
};

const ITEMS_SCHEMA = {
    question: { type: "text", label: "質問", default: "" },
    answer: { type: "textarea", label: "回答", default: "" },
};

export default function AccordionBlock({ data, onChange }) {
    const value = { ...ACCORDION_DEFAULT_DATA, ...data };

    return (
        <ArrayFieldEditor
            value={value.items}
            onChange={(items) => onChange({ ...value, items })}
            itemsSchema={ITEMS_SCHEMA}
            label="質問"
        />
    );
}

export function AccordionBlockPreview({ data }) {
    const value = { ...ACCORDION_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.question);
    if (items.length === 0) return null;

    return (
        <div className="divide-y divide-gray-200 border-y border-gray-200">
            {items.map((item, i) => (
                <details key={i} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900">
                        {item.question}
                        <span className="ml-4 shrink-0 text-gray-400 transition-transform group-open:rotate-45">
                            +
                        </span>
                    </summary>
                    {item.answer && (
                        <p className="mt-3 text-gray-600 whitespace-pre-line">{item.answer}</p>
                    )}
                </details>
            ))}
        </div>
    );
}
