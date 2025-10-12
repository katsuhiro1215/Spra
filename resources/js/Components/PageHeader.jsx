import React from "react";
import { router } from "@inertiajs/react";

const PageHeader = ({ title, description, actions = [], className = "" }) => {
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
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
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
                                case "secondary":
                                    return `${baseClasses} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50`;
                                case "success":
                                    return `${baseClasses} border border-transparent text-white bg-green-600 hover:bg-green-700`;
                                case "warning":
                                    return `${baseClasses} border border-transparent text-white bg-yellow-600 hover:bg-yellow-700`;
                                case "danger":
                                    return `${baseClasses} border border-transparent text-white bg-red-600 hover:bg-red-700`;
                                default:
                                    return `${baseClasses} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50`;
                            }
                        };

                        return (
                            <button
                                key={index}
                                onClick={() => handleActionClick(action)}
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
        </div>
    );
};

export default PageHeader;
