import { forwardRef } from "react";

const Badge = forwardRef((props, ref) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium";

    const variants = {
        primary:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        secondary:
            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
        success:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        warning:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        teal: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
        orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        outline:
            "bg-white border border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300",
        ghost: "bg-transparent text-slate-700 dark:text-slate-300",
    };

    const variantClass = variants[props.variant] || variants.info;

    const size = {
        xs: "text-xs px-2 py-0.5",
        sm: "text-xs px-2.5 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-2",
    };

    const sizeClass = size[props.size || "sm"];

    return (
        <span
            ref={ref}
            className={`${baseClasses} ${sizeClass} ${variantClass}`}
        >
            {props.children}
        </span>
    );
});

Badge.displayName = "Badge";

export default Badge;
