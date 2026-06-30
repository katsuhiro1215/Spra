import React from "react";
import { Link } from "@inertiajs/react";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function ServiceItemsTable({
    serviceItems,
    onDelete,
    isDeleting,
}) {
    if (!serviceItems || serviceItems.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    サービス項目が見つかりませんでした。
                </p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            inactive:
                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        };
        const labels = {
            active: "有効",
            inactive: "無効",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const getItemTypeBadge = (type) => {
        const badges = {
            plan_base:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            included:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            optional:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            addon: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
        const labels = {
            plan_base: "プラン基本",
            included: "含まれる",
            optional: "固有オプション",
            addon: "共通オプション",
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[type]}`}
            >
                {labels[type]}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            項目名
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            サービス
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            プラン
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            タイプ
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            価格
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            ステータス
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            アクション
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {serviceItems.map((item) => (
                        <tr
                            key={item.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                            {item.name}
                                            {item.is_required && (
                                                <CheckCircleIcon className="ml-2 h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                        {item.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {item.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {item.service?.name || "---"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {item.service_plan?.name || "---"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getItemTypeBadge(item.item_type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    ¥{Number(item.price).toLocaleString()}
                                </div>
                                {item.estimated_days && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.estimated_days}日
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={route(
                                            "admin.service.item.show",
                                            item.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.service.item.edit",
                                            item.id,
                                        )}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(item)}
                                        disabled={isDeleting === item.id}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
