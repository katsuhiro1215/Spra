import React from "react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const ServiceCategoriesTable = ({ serviceCategories, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: {
                className:
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                label: "稼働中",
            },
            inactive: {
                className:
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                label: "停止中",
            },
            suspended: {
                className:
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                label: "一時停止",
            },
        };

        const badge = badges[status] || badges.inactive;

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
            >
                {badge.label}
            </span>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.data.map((category) => (
                <Card key={category.id}>
                    {/* カテゴリヘッダー */}
                    <div
                        className="p-4 border-b border-gray-100 dark:border-gray-700"
                        style={{
                            borderLeftColor: category.color,
                            borderLeftWidth: "4px",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {category.icon && (
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                    >
                                        <i
                                            className={`heroicon-${category.icon} h-5 w-5`}
                                        ></i>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {category.slug}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {getStatusBadge(category.status)}
                                {!category.is_displayed && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                        非公開
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* カテゴリ詳細 */}
                    <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {category.description || "説明がありません"}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <span>表示順: {category.sort_order}</span>
                            <span>
                                作成日: {formatDate(category.created_at)}
                            </span>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={route(
                                    "admin.service.category.show",
                                    category.id,
                                )}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                詳細
                            </Link>
                            <Link
                                href={route(
                                    "admin.service.category.edit",
                                    category.id,
                                )}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                編集
                            </Link>
                            <button
                                onClick={() => onDelete(category)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                削除
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ServiceCategoriesTable;
