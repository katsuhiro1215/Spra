import React from "react";
import { router } from "@inertiajs/react";

const PageHeader = ({
    title,
    description,
    actions = [],
    variant = "default",
    updatedAt = null,
    className = "",
}) => {
    const variantClasses = {
        default: "bg-white text-gray-800",
        primary: "bg-blue-600 text-white",
        secondary: "bg-gray-200 text-gray-800",
        success: "bg-green-600 text-white",
        warning: "bg-yellow-600 text-white",
        danger: "bg-red-600 text-white",
    };
    const handleActionClick = (action) => {
        if (action.onClick) {
            action.onClick();
        } else if (action.route) {
            if (action.method === "post") {
                router.post(action.route, action.data || {});
            } else {
                router.get(action.route);
            }
        }
    };

    return (
        <header
            className={`${variantClasses[variant]} shadow-sm relative z-10 ${className}`}
        >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-gray-600 mt-1">{description}</p>
                        )}
                    </div>
                    {actions.length > 0 && (
                        <div className="flex items-center space-x-3">
                            {actions.map((action, index) => {
                                // アクションのタイプに応じてスタイルを決定
                                const getButtonClassName = (variant) => {
                                    const baseClasses =
                                        "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md";

                                    switch (variant) {
                                        case "primary":
                                            return `${baseClasses} border border-transparent text-white bg-blue-600 hover:bg-blue-700`;
                                        case "outlineBlue":
                                            return `${baseClasses} border border-blue-600 text-blue-600 bg-white hover:bg-blue-50`;
                                        case "softBlue":
                                            return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition`;
                                        case "secondary":
                                            return `${baseClasses} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50`;
                                        case "success":
                                            return `${baseClasses} border border-transparent text-white bg-green-600 hover:bg-green-700`;
                                        case "outlineGreen":
                                            return `${baseClasses} border border-green-600 text-green-600 bg-white hover:bg-green-50`;
                                        case "softGreen":
                                            return `${baseClasses} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition`;
                                        case "warning":
                                            return `${baseClasses} border border-transparent text-white bg-yellow-600 hover:bg-yellow-700`;
                                        case "danger":
                                            return `${baseClasses} border border-transparent text-white bg-red-600 hover:bg-red-700`;
                                        case "outlineYellow":
                                            return `${baseClasses} border border-yellow-600 text-yellow-600 bg-white hover:bg-yellow-50`;
                                        case "softYellow":
                                            return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 transition`;
                                        case "outlineRed":
                                            return `${baseClasses} border border-red-600 text-red-600 bg-white hover:bg-red-50`;
                                        case "softRed":
                                            return `${baseClasses} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition`;
                                        default:
                                            return `${baseClasses} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50`;
                                    }
                                };

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleActionClick(action)
                                        }
                                        disabled={action.disabled}
                                        className={`${getButtonClassName(
                                            action.variant
                                        )} ${
                                            action.disabled
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {action.icon && (
                                            <action.icon className="w-4 h-4 mr-2" />
                                        )}
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {updatedAt && (
                        <div className="ml-6 text-sm text-gray-500">
                            最終更新: {updatedAt}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
