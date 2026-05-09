import React from "react";
import { router, Link } from "@inertiajs/react";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

const PageHeader = ({
    title,
    description,
    actions = [],
    breadcrumbs = [],
    variant = "default",
    updatedAt = null,
    className = "",
}) => {
    // variant="default"の場合はダークモード対応、それ以外は特殊用途のカラー
    const getHeaderClasses = () => {
        if (variant === "default") {
            return "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
        }
        // 特殊カラー用（ダークモード非対応）
        const variantClasses = {
            primary: "bg-blue-600 text-white",
            secondary:
                "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
            success: "bg-green-600 text-white",
            warning: "bg-yellow-600 text-white",
            danger: "bg-red-600 text-white",
        };
        return variantClasses[variant] || variantClasses.default;
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
            className={`${getHeaderClasses()} w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 shadow-sm dark:shadow-gray-900/20 relative z-10 transition-colors ${className}`}
        >
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="mb-4" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <li className="flex items-center">
                            <Link
                                href={route("admin.dashboard")}
                                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                <HomeIcon className="h-4 w-4" />
                            </Link>
                        </li>
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <li key={index} className="flex items-center">
                                    <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
                                    {isLast ? (
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {typeof crumb === "string"
                                                ? crumb
                                                : crumb.label}
                                        </span>
                                    ) : (
                                        <Link
                                            href={
                                                typeof crumb === "string"
                                                    ? "#"
                                                    : crumb.url || "#"
                                            }
                                            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            {typeof crumb === "string"
                                                ? crumb
                                                : crumb.label}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            )}

            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
                {actions.length > 0 && (
                    <div className="flex items-center space-x-3">
                        {actions.map((action, index) => {
                            // アクションのタイプに応じてスタイルを決定
                            const getButtonClassName = (variant) => {
                                const baseClasses =
                                    "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200";

                                switch (variant) {
                                    case "primary":
                                        return `${baseClasses} border border-transparent text-white shadow-md hover:shadow-lg`;
                                    case "outlineBlue":
                                        return `${baseClasses} border text-white bg-white hover:opacity-90 dark:bg-gray-800 dark:hover:bg-gray-700`;
                                    case "softBlue":
                                        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/50`;
                                    case "secondary":
                                        return `${baseClasses} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700`;
                                    case "success":
                                        return `${baseClasses} border border-transparent text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600`;
                                    case "outlineGreen":
                                        return `${baseClasses} border border-green-600 text-green-600 bg-white hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:bg-gray-800 dark:hover:bg-gray-700`;
                                    case "softGreen":
                                        return `${baseClasses} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/50`;
                                    case "warning":
                                        return `${baseClasses} border border-transparent text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600`;
                                    case "danger":
                                        return `${baseClasses} border border-transparent text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600`;
                                    case "outlineYellow":
                                        return `${baseClasses} border border-yellow-600 text-yellow-600 bg-white hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:bg-gray-800 dark:hover:bg-gray-700`;
                                    case "softYellow":
                                        return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900/50`;
                                    case "outlineRed":
                                        return `${baseClasses} border border-red-600 text-red-600 bg-white hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:bg-gray-800 dark:hover:bg-gray-700`;
                                    case "softRed":
                                        return `${baseClasses} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50`;
                                    default:
                                        return `${baseClasses} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700`;
                                }
                            };

                            // primaryボタンにはカラーテーマを適用
                            const getButtonStyle = (variant) => {
                                if (variant === "primary") {
                                    return {
                                        backgroundColor: "var(--color-primary)",
                                    };
                                }
                                if (variant === "outlineBlue") {
                                    return {
                                        borderColor: "var(--color-primary)",
                                        color: "var(--color-primary)",
                                    };
                                }
                                return {};
                            };

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleActionClick(action)}
                                    disabled={action.disabled}
                                    className={`${getButtonClassName(
                                        action.variant,
                                    )} ${
                                        action.disabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    style={getButtonStyle(action.variant)}
                                    onMouseEnter={(e) => {
                                        if (
                                            action.variant === "primary" &&
                                            !action.disabled
                                        ) {
                                            e.currentTarget.style.backgroundColor =
                                                "var(--color-primary-hover)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (
                                            action.variant === "primary" &&
                                            !action.disabled
                                        ) {
                                            e.currentTarget.style.backgroundColor =
                                                "var(--color-primary)";
                                        }
                                    }}
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
                    <div className="ml-6 text-sm text-gray-500 dark:text-gray-400">
                        最終更新: {updatedAt}
                    </div>
                )}
            </div>
        </header>
    );
};

export default PageHeader;
