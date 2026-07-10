import React from "react";
import { router, Link } from "@inertiajs/react";
// Icons
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

const UserPageHeader = ({
    title,
    description,
    actions = [],
    breadcrumbs = [],
    variant = "default",
    updatedAt = null,
    className = "",
}) => {
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
            className={`w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 relative z-10 ${className}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* 左: タイトル・説明 */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-gray-600 mt-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* 右: パンくずリストとアクション */}
                <div className="flex flex-col gap-4 sm:items-end">
                    {/* パンくずリスト */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="flex items-center gap-1 text-sm">
                            {breadcrumbs.map((crumb, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1"
                                >
                                    {index > 0 && (
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                    )}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="text-indigo-600 hover:text-indigo-700"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-600">
                                            {crumb.label}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </nav>
                    )}

                    {/* アクションボタン */}
                    {actions && actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-end">
                            {actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleActionClick(action)}
                                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        action.variant === "primary"
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : action.variant === "secondary"
                                              ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UserPageHeader;
