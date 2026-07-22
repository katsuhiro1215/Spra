import React from "react";
import { ArrayFieldEditor } from "@/Components/Forms";

export const STEPS_DEFAULT_DATA = {
    items: [],
};

const ITEMS_SCHEMA = {
    title: { type: "text", label: "タイトル", default: "" },
    text: { type: "textarea", label: "説明文", default: "" },
};

export default function StepsBlock({ data, onChange }) {
    const value = { ...STEPS_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <ArrayFieldEditor
                value={value.items}
                onChange={(items) => onChange({ ...value, items })}
                itemsSchema={ITEMS_SCHEMA}
                label="ステップ"
            />
        </div>
    );
}

export function StepsBlockPreview({ data }) {
    const value = { ...STEPS_DEFAULT_DATA, ...data };
    const items = (value.items || []).filter((item) => item.title || item.text);
    if (items.length === 0) return null;

    return (
        <div className="flex flex-col md:flex-row md:items-start">
            {items.map((item, i) => (
                <React.Fragment key={i}>
                    <div className="flex-1 text-center px-2">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                            {i + 1}
                        </div>
                        {item.title && (
                            <h4 className="font-bold text-gray-900 mb-1">
                                {item.title}
                            </h4>
                        )}
                        {item.text && (
                            <p className="text-gray-600 text-sm whitespace-pre-line">
                                {item.text}
                            </p>
                        )}
                    </div>
                    {i < items.length - 1 && (
                        <div className="flex items-center justify-center py-2 md:py-0 md:px-1 md:pt-6">
                            <svg
                                className="h-6 w-6 rotate-90 text-gray-300 md:rotate-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
