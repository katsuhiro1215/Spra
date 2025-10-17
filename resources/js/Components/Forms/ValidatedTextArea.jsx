import React, { forwardRef } from "react";
import InputLabel from "@/Components/Forms/InputLabel";
import InputError from "@/Components/Forms/InputError";

const ValidatedTextArea = forwardRef(
    (
        {
            label,
            name,
            value,
            onChange,
            onBlur,
            placeholder,
            required = false,
            rows = 4,
            error,
            touched,
            className = "",
            ...props
        },
        ref
    ) => {
        const textareaClassName = `
        w-full border rounded-md px-3 py-2 shadow-sm
        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        resize-vertical
        ${
            error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
        }
        ${className}
    `.trim();

        return (
            <div>
                {label && (
                    <InputLabel
                        htmlFor={name}
                        value={label}
                        className={
                            required
                                ? "after:content-['*'] after:ml-1 after:text-red-500"
                                : ""
                        }
                    />
                )}

                <textarea
                    ref={ref}
                    id={name}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    rows={rows}
                    className={textareaClassName}
                    {...props}
                />

                <InputError message={error} className="mt-1" />
            </div>
        );
    }
);

ValidatedTextArea.displayName = "ValidatedTextArea";

export default ValidatedTextArea;
