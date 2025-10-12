import React from "react";
import { router } from "@inertiajs/react";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    PencilIcon,
    EyeIcon,
    TrashIcon,
    DocumentDuplicateIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

const ServiceTypesTable = ({
    serviceTypes,
    selectedItems,
    onToggleSelectAll,
    onToggleSelectItem,
    data,
    onSort,
    pricingModels,
    onDelete,
}) => {
    const SortIcon = ({ field }) => {
        if (data.sort !== field) return null;
        return data.direction === "asc" ? (
            <ArrowUpIcon className="w-4 h-4" />
        ) : (
            <ArrowDownIcon className="w-4 h-4" />
        );
    };

    const getStatusBadge = (serviceType) => {
        if (!serviceType.is_active) {
            return (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    非アクティブ
                </span>
            );
        }
        if (serviceType.is_featured) {
            return (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                    <StarIcon className="w-3 h-3 mr-1" />
                    おすすめ
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                アクティブ
            </span>
        );
    };

    const getPricingModelBadge = (model) => {
        const badges = {
            fixed: "bg-blue-100 text-blue-800",
            subscription: "bg-purple-100 text-purple-800",
            custom: "bg-orange-100 text-orange-800",
            hybrid: "bg-indigo-100 text-indigo-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    badges[model] || "bg-gray-100 text-gray-800"
                }`}
            >
                {pricingModels[model] || model}
            </span>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={
                                        serviceTypes?.data?.length > 0 &&
                                        selectedItems.length ===
                                            serviceTypes.data.length
                                    }
                                    onChange={onToggleSelectAll}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                />
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => onSort("name")}
                            >
                                <div className="flex items-center">
                                    サービスタイプ
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                カテゴリ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                料金体系
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => onSort("base_price")}
                            >
                                <div className="flex items-center">
                                    基本価格
                                    <SortIcon field="base_price" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ステータス
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => onSort("updated_at")}
                            >
                                <div className="flex items-center">
                                    更新日
                                    <SortIcon field="updated_at" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {serviceTypes.data && serviceTypes.data.length > 0 ? (
                            serviceTypes.data.map((serviceType) => (
                                <tr
                                    key={serviceType.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                serviceType.id
                                            )}
                                            onChange={() =>
                                                onToggleSelectItem(
                                                    serviceType.id
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {serviceType.color && (
                                                <div
                                                    className="w-4 h-4 rounded-full mr-3"
                                                    style={{
                                                        backgroundColor:
                                                            serviceType.color,
                                                    }}
                                                ></div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {serviceType.name}
                                                </div>
                                                {serviceType.description && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {
                                                            serviceType.description
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {serviceType.service_category?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getPricingModelBadge(
                                            serviceType.pricing_model
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {serviceType.base_price
                                            ? `¥${Number(
                                                  serviceType.base_price
                                              ).toLocaleString()}` +
                                              (serviceType.price_unit
                                                  ? `/${serviceType.price_unit}`
                                                  : "")
                                            : "要相談"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(serviceType)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(
                                            serviceType.updated_at
                                        ).toLocaleDateString("ja-JP")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "admin.service.service-types.show",
                                                        serviceType.id
                                                    )
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "admin.service.service-types.edit",
                                                        serviceType.id
                                                    )
                                                )
                                            }
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        "admin.service.service-types.duplicate",
                                                        serviceType.id
                                                    )
                                                )
                                            }
                                            className="text-purple-600 hover:text-purple-900"
                                        >
                                            <DocumentDuplicateIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                onDelete(serviceType.id)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center">
                                        <DocumentDuplicateIcon className="w-12 h-12 text-gray-300 mb-2" />
                                        <p>サービスタイプが見つかりません</p>
                                        <p className="text-sm">
                                            検索条件を変更するか、新しいサービスタイプを作成してください
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceTypesTable;
