import React from "react";
import { TextInput, SelectInput, FormGroup } from "@/Components/Forms";

export const HEADING_DEFAULT_DATA = {
    text: "",
    level: "h2",
    align: "left",
};

export default function HeadingBlock({ data, onChange }) {
    const value = { ...HEADING_DEFAULT_DATA, ...data };

    return (
        <div className="space-y-3">
            <FormGroup label="見出しテキスト">
                <TextInput
                    value={value.text}
                    onChange={(e) => onChange({ ...value, text: e.target.value })}
                    placeholder="見出しを入力..."
                />
            </FormGroup>
            <div className="grid grid-cols-2 gap-3">
                <FormGroup label="見出しレベル">
                    <SelectInput
                        value={value.level}
                        onChange={(e) => onChange({ ...value, level: e.target.value })}
                    >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
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
        </div>
    );
}

export function HeadingBlockPreview({ data }) {
    const value = { ...HEADING_DEFAULT_DATA, ...data };
    if (!value.text) return null;
    const Tag = value.level;
    const alignClass =
        value.align === "center"
            ? "text-center"
            : value.align === "right"
              ? "text-right"
              : "text-left";

    return (
        <Tag className={`font-bold text-gray-900 ${alignClass}`}>{value.text}</Tag>
    );
}
