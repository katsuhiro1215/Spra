import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function SelectInput(
    { className = "", isFocused = false, options = [], children, ...props },
    ref,
) {
    const select = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            select.current.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                "w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed " +
                className
            }
            ref={select}
        >
            {options.length > 0
                ? options.map((option) => (
                      <option key={option.value} value={option.value}>
                          {option.label}
                      </option>
                  ))
                : children}
        </select>
    );
});
