import React from "react";
import { TextInput, TextArea, FormGroup } from "@/Components/Forms";

export const CARD_DEFAULT_DATA = {
    icon: "",
    imageUrl: "",
    title: "",
    text: "",
    buttonLabel: "",
    buttonUrl: "",
};

export default function CardBlock({ data, onChange }) {
    const value = { ...CARD_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="アイコン（絵文字・任意）">
                    <TextInput
                        value={value.icon}
                        onChange={(e) => onChange({ ...value, icon: e.target.value })}
                        placeholder="🚀"
                    />
                </FormGroup>
                <FormGroup label="画像URL（任意）">
                    <TextInput
                        value={value.imageUrl}
                        onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                    />
                </FormGroup>
            </div>
            <FormGroup label="タイトル">
                <TextInput
                    value={value.title}
                    onChange={(e) => onChange({ ...value, title: e.target.value })}
                    placeholder="カードのタイトル"
                />
            </FormGroup>
            <FormGroup label="本文">
                <TextArea
                    value={value.text}
                    onChange={(e) => onChange({ ...value, text: e.target.value })}
                    rows={3}
                    placeholder="カードの説明文"
                />
            </FormGroup>
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="ボタンラベル（任意）">
                    <TextInput
                        value={value.buttonLabel}
                        onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
                        placeholder="詳しく見る"
                    />
                </FormGroup>
                <FormGroup label="リンク先URL（任意）">
                    <TextInput
                        value={value.buttonUrl}
                        onChange={(e) => onChange({ ...value, buttonUrl: e.target.value })}
                        placeholder="/services/example"
                    />
                </FormGroup>
            </div>
        </div>
    );
}

export function CardBlockPreview({ data }) {
    const value = { ...CARD_DEFAULT_DATA, ...data };
    if (!value.title && !value.text) return null;

    return (
        <div className="max-w-md mx-auto rounded-2xl border border-gray-200 shadow-md overflow-hidden bg-white">
            {value.imageUrl && (
                <img src={value.imageUrl} alt={value.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
                {value.icon && <div className="text-4xl mb-3">{value.icon}</div>}
                {value.title && (
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                )}
                {value.text && <p className="text-gray-600">{value.text}</p>}
                {value.buttonLabel && value.buttonUrl && (
                    <a
                        href={value.buttonUrl}
                        className="inline-flex items-center gap-1 mt-4 text-blue-600 font-semibold hover:text-blue-700"
                    >
                        {value.buttonLabel} →
                    </a>
                )}
            </div>
        </div>
    );
}
