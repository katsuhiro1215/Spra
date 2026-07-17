import React from "react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { Badge } from "@/Components/Badges";
import { getStatusBadge } from "@/Constants/Badges";

const ServicesGrid = ({ services, onDelete, isDeleting }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.data.map((service) => (
                <Card key={service.id}>
                    {/* サービスヘッダー */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                {service.icon && (
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                        <i
                                            className={`heroicon-${service.icon} h-5 w-5`}
                                        ></i>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {service.name}
                                        </h3>
                                        {service.is_featured && (
                                            <StarIconSolid className="h-5 w-5 text-yellow-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {service.slug}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {service.service_category?.name || "未分類"}
                            </span>
                            <div className="flex items-center gap-1">
                                <Badge
                                    variant={
                                        getStatusBadge(service.status).variant
                                    }
                                    size="sm"
                                >
                                    {getStatusBadge(service.status).text}
                                </Badge>
                                {!service.is_displayed && (
                                    <Badge variant="secondary" size="sm">
                                        非公開
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* サービス詳細 */}
                    <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {service.description || "説明がありません"}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <span>表示順: {service.sort_order}</span>
                            <span>
                                作成日: {formatDate(service.created_at)}
                            </span>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={route("admin.service.show", service.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                詳細
                            </Link>
                            <Link
                                href={route("admin.service.edit", service.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                編集
                            </Link>
                            <button
                                onClick={() => onDelete(service)}
                                disabled={isDeleting === service.id}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                {isDeleting === service.id
                                    ? "削除中..."
                                    : "削除"}
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ServicesGrid;
