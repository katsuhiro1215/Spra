import React, { forwardRef } from "react";
import InputLabel from "@/Components/Forms/InputLabel";
import InputError from "@/Components/Forms/InputError";

const ValidatedInput = forwardRef(
    (
        {
            label,
            name,
            type = "text",
            value,
            onChange,
            onBlur,
            placeholder,
            required = false,
            error,
            touched,
            className = "",
            ...props
        },
        ref
    ) => {
        const inputClassName = `
        w-full border rounded-md px-3 py-2 shadow-sm
        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
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

                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={type}
                    value={value || ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    className={inputClassName}
                    {...props}
                />

                <InputError message={error} className="mt-1" />
            </div>
        );
    }
);

ValidatedInput.displayName = "ValidatedInput";

export default ValidatedInput;
