import React from "react";
import InputLabel from "./InputLabel";
import SelectInput from "./SelectInput";
import InputError from "./InputError";

/**
 * FormSelect - ラベルとエラー表示を含む選択フィールド
 */
export default function FormSelect({
    label,
    name,
    value,
    onChange,
    error,
    options = [],
    required = false,
    disabled = false,
    helpText,
    className = "",
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <InputLabel htmlFor={name} value={label} required={required} />
            )}

            <SelectInput
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                disabled={disabled}
                {...props}
            />

            {helpText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helpText}</p>
            )}

            {error && <InputError message={error} className="mt-1" />}
        </div>
    );
}
