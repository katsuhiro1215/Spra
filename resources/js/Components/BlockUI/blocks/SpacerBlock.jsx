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
    return <div style={{ height: `${value.height}px` }} />;
}
