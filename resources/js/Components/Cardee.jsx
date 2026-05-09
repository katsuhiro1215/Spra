import { forwardRef } from "react";
import clsx from "clsx";

const Card = forwardRef(
    ({ variant = "default", className = "", children, ...props }, ref) => {
        // base
        const baseClasses = "bg-white border border-gray-200 rounded-lg p-6";
        // color
        const variants = {
            default: "",
            primary: "border-blue-500",
            secondary: "border-gray-500",
            success: "border-green-500",
            warning: "border-yellow-500",
            danger: "border-red-500",
            info: "border-cyan-500",
        };

        const classes = `${baseClasses} ${
            variants[variant] || ""
        } ${className}`;

        return (
            <div
                className={clsx(baseClasses, variants[variant], className)}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.Image = function CardImage({ src, alt = "", className = "" }) {
    return (
        <div className="w-full h-48 overflow-hidden">
            <img
                src={src}
                alt={alt}
                className={clsx(
                    "w-full h-full object-cover transition-transform duration-300 hover:scale-105",
                    className
                )}
            />
        </div>
    );
};

Card.Title = function CardTitle({ children, className = "" }) {
    return (
        <h3
            className={clsx(
                "text-lg font-medium text-gray-900 mb-4",
                className
            )}
        >
            {children}
        </h3>
    );
};

Card.Body = function CardBody({ children, className = "" }) {
    return (
        <div
            className={clsx(
                "text-gray-700 text-sm",
                className
            )}
        >
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ children, className = "" }) {
    return (
        <div
            className={clsx(
                "px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-600",
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card;
