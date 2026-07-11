import React from "react";
import { NumberInput, FormGroup } from "@/Components/Forms";

export const SPACER_DEFAULT_DATA = {
    height: 40,
};

export default function SpacerBlock({ data, onChange }) {
    const value = { ...SPACER_DEFAULT_DATA, ...data };

    return (
        <FormGroup label="高さ（px）">
            <NumberInput
                value={value.height}
                min={0}
                max={400}
                onChange={(val) => onChange({ ...value, height: val ?? 0 })}
            />
        </FormGroup>
    );
}

export function SpacerBlockPreview({ data }) {
    const value = { ...SPACER_DEFAULT_DATA, ...data };

    return (
        <div
            style={{ height: `${Math.min(value.height, 120)}px` }}
            className="w-full flex items-center justify-center text-xs text-slate-300 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-700 rounded"
        >
            {value.height}px
        </div>
    );
}
