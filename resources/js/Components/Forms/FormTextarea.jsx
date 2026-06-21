import React from "react";
import InputLabel from "./InputLabel";
import TextArea from "./TextArea";
import InputError from "./InputError";

/**
 * FormTextarea - ラベルとエラー表示を含むテキストエリアフィールド
 */
export default function FormTextarea({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    helpText,
    rows = 4,
    className = "",
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <InputLabel htmlFor={name} value={label} required={required} />
            )}

            <TextArea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
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
