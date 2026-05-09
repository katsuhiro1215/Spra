import { forwardRef } from "react";

export default forwardRef(function NumberInput(
    {
        value,
        onChange,
        min,
        max,
        step = 1,
        placeholder = "",
        disabled = false,
        className = "",
        ...props
    },
    ref,
) {
    const handleChange = (e) => {
        const val = e.target.value === "" ? null : Number(e.target.value);
        onChange?.(val);
    };

    return (
        <input
            ref={ref}
            type="number"
            value={value ?? ""}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        />
    );
});
