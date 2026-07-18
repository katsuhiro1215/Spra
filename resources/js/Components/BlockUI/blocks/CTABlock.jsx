import React from "react";
import { TextInput, TextArea, SelectInput, FormGroup, Toggle } from "@/Components/Forms";

export const CTA_DEFAULT_DATA = {
    heading: "",
    text: "",
    buttonLabel: "",
    buttonUrl: "",
    openInNewTab: false,
    background: "gradient",
};

export default function CTABlock({ data, onChange }) {
    const value = { ...CTA_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <FormGroup label="見出し">
                <TextInput
                    value={value.heading}
                    onChange={(e) => onChange({ ...value, heading: e.target.value })}
                    placeholder="お気軽にお問い合わせください"
                />
            </FormGroup>
            <FormGroup label="説明文">
                <TextArea
                    value={value.text}
                    onChange={(e) => onChange({ ...value, text: e.target.value })}
                    rows={2}
                    placeholder="ご質問やお見積りのご相談は無料です。"
                />
            </FormGroup>
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="ボタンラベル">
                    <TextInput
                        value={value.buttonLabel}
                        onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
                        placeholder="お問い合わせはこちら"
                    />
                </FormGroup>
                <FormGroup label="リンク先URL">
                    <TextInput
                        value={value.buttonUrl}
                        onChange={(e) => onChange({ ...value, buttonUrl: e.target.value })}
                        placeholder="/contact"
                    />
                </FormGroup>
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
                <FormGroup label="背景スタイル">
                    <SelectInput
                        value={value.background}
                        onChange={(e) => onChange({ ...value, background: e.target.value })}
                    >
                        <option value="gradient">グラデーション</option>
                        <option value="dark">ダーク</option>
                        <option value="light">ライト</option>
                    </SelectInput>
                </FormGroup>
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
        </div>
    );
}

const BACKGROUND_CLASSES = {
    gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
    dark: "bg-gray-900 text-white",
    light: "bg-gray-50 text-gray-900",
};

const BUTTON_CLASSES = {
    gradient: "bg-white text-blue-600 hover:bg-gray-100",
    dark: "bg-white text-gray-900 hover:bg-gray-100",
    light: "bg-gray-900 text-white hover:bg-gray-800",
};

export function CTABlockPreview({ data }) {
    const value = { ...CTA_DEFAULT_DATA, ...data };
    if (!value.heading && !value.text) return null;

    return (
        <div
            className={`rounded-2xl px-8 py-12 text-center ${
                BACKGROUND_CLASSES[value.background] || BACKGROUND_CLASSES.gradient
            }`}
        >
            {value.heading && (
                <h3 className="text-2xl md:text-3xl font-bold">{value.heading}</h3>
            )}
            {value.text && <p className="mt-3 text-lg opacity-90">{value.text}</p>}
            {value.buttonLabel && value.buttonUrl && (
                <a
                    href={value.buttonUrl}
                    target={value.openInNewTab ? "_blank" : undefined}
                    rel={value.openInNewTab ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center justify-center gap-2 mt-6 px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                        BUTTON_CLASSES[value.background] || BUTTON_CLASSES.gradient
                    }`}
                >
                    {value.buttonLabel}
                </a>
            )}
        </div>
    );
}
