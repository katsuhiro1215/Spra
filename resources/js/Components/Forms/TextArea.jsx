import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function TextArea(
    {
        className = "",
        isFocused = false,
        rows = 4,
        resize = "vertical",
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const resizeClasses = {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
    };

    return (
        <textarea
            {...props}
            rows={rows}
            className={
                `w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${resizeClasses[resize]} ` +
                className
            }
            ref={localRef}
        />
    );
});
