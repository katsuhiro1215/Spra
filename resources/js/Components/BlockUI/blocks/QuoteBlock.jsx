import React from "react";
import { TextInput, TextArea, FormGroup } from "@/Components/Forms";

export const QUOTE_DEFAULT_DATA = {
    text: "",
    author: "",
    role: "",
};

export default function QuoteBlock({ data, onChange }) {
    const value = { ...QUOTE_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <FormGroup label="引用文">
                <TextArea
                    value={value.text}
                    onChange={(e) => onChange({ ...value, text: e.target.value })}
                    rows={4}
                    placeholder="お客様の声やメッセージを入力..."
                />
            </FormGroup>
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="発言者名">
                    <TextInput
                        value={value.author}
                        onChange={(e) => onChange({ ...value, author: e.target.value })}
                        placeholder="山田 太郎"
                    />
                </FormGroup>
                <FormGroup label="役職・所属">
                    <TextInput
                        value={value.role}
                        onChange={(e) => onChange({ ...value, role: e.target.value })}
                        placeholder="株式会社〇〇 代表取締役"
                    />
                </FormGroup>
            </div>
        </div>
    );
}

export function QuoteBlockPreview({ data }) {
    const value = { ...QUOTE_DEFAULT_DATA, ...data };
    if (!value.text) return null;

    return (
        <blockquote className="border-l-4 border-blue-600 pl-6 py-2">
            <p className="text-xl text-gray-700 italic leading-relaxed">
                &ldquo;{value.text}&rdquo;
            </p>
            {(value.author || value.role) && (
                <footer className="mt-3 text-sm text-gray-500">
                    {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                    {value.author && value.role && <span> / </span>}
                    {value.role}
                </footer>
            )}
        </blockquote>
    );
}
