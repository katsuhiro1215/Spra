import React from "react";
import RichTextEditor from "@/Components/Forms/RichTextEditor";

export const TEXT_DEFAULT_DATA = {
    html: "",
};

export default function TextBlock({ data, onChange }) {
    const value = { ...TEXT_DEFAULT_DATA, ...data };

    return (
        <RichTextEditor
            value={value.html}
            onChange={(html) => onChange({ ...value, html })}
            height={280}
            placeholder="本文を入力してください..."
        />
    );
}

export function TextBlockPreview({ data }) {
    const value = { ...TEXT_DEFAULT_DATA, ...data };
    if (!value.html) return null;

    return (
        <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: value.html }}
        />
    );
}
