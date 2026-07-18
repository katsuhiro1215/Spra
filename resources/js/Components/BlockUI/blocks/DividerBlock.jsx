import React from "react";
import { SelectInput, FormGroup } from "@/Components/Forms";

export const DIVIDER_DEFAULT_DATA = {
    style: "solid",
    width: "full",
    color: "medium",
};

const WIDTH_CLASSES = {
    full: "w-full",
    wide: "max-w-3xl",
    narrow: "max-w-md",
};

const COLOR_CLASSES = {
    light: "border-gray-200",
    medium: "border-gray-300",
    dark: "border-gray-500",
};

export default function DividerBlock({ data, onChange }) {
    const value = { ...DIVIDER_DEFAULT_DATA, ...data };

    return (
        <div className="grid grid-cols-3 gap-3">
            <FormGroup label="線の種類">
                <SelectInput
                    value={value.style}
                    onChange={(e) => onChange({ ...value, style: e.target.value })}
                >
                    <option value="solid">実線</option>
                    <option value="dashed">破線</option>
                    <option value="dotted">点線</option>
                </SelectInput>
            </FormGroup>
            <FormGroup label="幅">
                <SelectInput
                    value={value.width}
                    onChange={(e) => onChange({ ...value, width: e.target.value })}
                >
                    <option value="full">全幅</option>
                    <option value="wide">ワイド</option>
                    <option value="narrow">標準</option>
                </SelectInput>
            </FormGroup>
            <FormGroup label="濃さ">
                <SelectInput
                    value={value.color}
                    onChange={(e) => onChange({ ...value, color: e.target.value })}
                >
                    <option value="light">薄い</option>
                    <option value="medium">標準</option>
                    <option value="dark">濃い</option>
                </SelectInput>
            </FormGroup>
        </div>
    );
}

export function DividerBlockPreview({ data }) {
    const value = { ...DIVIDER_DEFAULT_DATA, ...data };

    return (
        <div className={`${WIDTH_CLASSES[value.width] || WIDTH_CLASSES.full} mx-auto`}>
            <hr
                className={`border-t-2 ${
                    value.style === "dashed"
                        ? "border-dashed"
                        : value.style === "dotted"
                          ? "border-dotted"
                          : "border-solid"
                } ${COLOR_CLASSES[value.color] || COLOR_CLASSES.medium}`}
            />
        </div>
    );
}
