import { forwardRef } from "react";

const Badge = forwardRef((props, ref) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium";

    const variants = {
        primary: "bg-blue-100 text-blue-800 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-800 focus:ring-gray-500",
        success: "bg-green-100 text-green-800 focus:ring-green-500",
        danger: "bg-red-100 text-red-800 focus:ring-red-500",
        warning: "bg-yellow-100 text-yellow-800 focus:ring-yellow-500",
        info: "bg-blue-100 text-blue-800 focus:ring-blue-500",
        pink: "bg-pink-100 text-pink-800 focus:ring-pink-500",
        purple: "bg-purple-100 text-purple-800 focus:ring-purple-500",
        teal: "bg-teal-100 text-teal-800 focus:ring-teal-500",
        orange: "bg-orange-100 text-orange-800 focus:ring-orange-500",
        outline: "bg-white border border-gray-300 text-gray-700 focus:ring-blue-500",
        ghost: "bg-transparent text-gray-700 focus:ring-gray-500",
    };

    const variantClass = variants[props.variant] || variants.info;

    const size = {
        sm: "text-xs px-2.5 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-2",
    };

    return (
        <span
            ref={ref}
            className={`${baseClasses} ${size[props.size]} ${variantClass}`}
        >
            {props.children}
        </span>
    );
});

export default Badge;
