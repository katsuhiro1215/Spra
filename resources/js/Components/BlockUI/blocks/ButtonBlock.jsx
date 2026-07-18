import React from "react";
import { TextInput, SelectInput, FormGroup, Toggle } from "@/Components/Forms";

export const BUTTON_DEFAULT_DATA = {
    label: "",
    url: "",
    style: "primary",
    align: "left",
    openInNewTab: false,
};

export default function ButtonBlock({ data, onChange }) {
    const value = { ...BUTTON_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="ボタンラベル">
                    <TextInput
                        value={value.label}
                        onChange={(e) => onChange({ ...value, label: e.target.value })}
                        placeholder="詳しくはこちら"
                    />
                </FormGroup>
                <FormGroup label="リンク先URL">
                    <TextInput
                        value={value.url}
                        onChange={(e) => onChange({ ...value, url: e.target.value })}
                        placeholder="https://example.com または /contact"
                    />
                </FormGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="スタイル">
                    <SelectInput
                        value={value.style}
                        onChange={(e) => onChange({ ...value, style: e.target.value })}
                    >
                        <option value="primary">プライマリ</option>
                        <option value="secondary">セカンダリ</option>
                        <option value="outline">アウトライン</option>
                    </SelectInput>
                </FormGroup>
                <FormGroup label="配置">
                    <SelectInput
                        value={value.align}
                        onChange={(e) => onChange({ ...value, align: e.target.value })}
                    >
                        <option value="left">左揃え</option>
                        <option value="center">中央揃え</option>
                        <option value="right">右揃え</option>
                    </SelectInput>
                </FormGroup>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                    新しいタブで開く
                </span>
                <Toggle
                    enabled={value.openInNewTab}
                    onChange={(v) => onChange({ ...value, openInNewTab: v })}
                />
            </div>
        </div>
    );
}

const STYLE_CLASSES = {
    primary:
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
};

export function ButtonBlockPreview({ data }) {
    const value = { ...BUTTON_DEFAULT_DATA, ...data };
    if (!value.label || !value.url) return null;
    const alignClass =
        value.align === "center"
            ? "justify-center"
            : value.align === "right"
              ? "justify-end"
              : "justify-start";

    return (
        <div className={`flex ${alignClass}`}>
            <a
                href={value.url}
                target={value.openInNewTab ? "_blank" : undefined}
                rel={value.openInNewTab ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                    STYLE_CLASSES[value.style] || STYLE_CLASSES.primary
                }`}
            >
                {value.label}
            </a>
        </div>
    );
}
