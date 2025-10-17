import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    PencilIcon,
    EyeIcon,
    TrashIcon,
    DocumentDuplicateIcon,
    StarIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const ServiceTypesIndex = ({
    serviceTypes,
    serviceCategories,
    pricingModels,
    filters,
    sort,
}) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [bulkAction, setBulkAction] = useState("");

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        category_id: filters.category_id || "",
        pricing_model: filters.pricing_model || "",
        status: filters.status || "",
        sort: sort.field,
        direction: sort.direction,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route("admin.service.service-types.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (field) => {
        const direction =
            data.sort === field && data.direction === "asc" ? "desc" : "asc";
        setData("sort", field);
        setData("direction", direction);
        get(route("admin.service.service-types.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBulkAction = () => {
        if (!bulkAction || selectedItems.length === 0) return;

        if (bulkAction === "delete") {
            if (
                !confirm(
                    `選択した${selectedItems.length}件のサービスタイプを削除しますか？`
                )
            ) {
                return;
            }
        }

        router.post(
            route("admin.service.service-types.bulk-action"),
            {
                action: bulkAction,
                ids: selectedItems,
            },
            {
                onSuccess: () => {
                    setSelectedItems([]);
                    setBulkAction("");
                },
            }
        );
    };

    const toggleSelectAll = () => {
        const dataArray = serviceTypes?.data || [];
        if (selectedItems.length === dataArray.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(dataArray.map((item) => item.id));
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
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

    const SortIcon = ({ field }) => {
        if (data.sort !== field) return null;
        return data.direction === "asc" ? (
            <ArrowUpIcon className="w-4 h-4" />
        ) : (
            <ArrowDownIcon className="w-4 h-4" />
        );
    };

    return (
        <AdminLayout>
            <Head title="サービスタイプ管理" />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            サービスタイプ管理
                        </h1>
                        <p className="text-gray-600">
                            契約管理のベースとなるサービスタイプを管理します
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            router.get(
                                route("admin.service.service-types.create")
                            )
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        新規作成
                    </button>
                </div>

                {/* 検索・フィルター */}
                <div className="bg-white shadow rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex-1 min-w-64">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.search}
                                        onChange={(e) =>
                                            setData("search", e.target.value)
                                        }
                                        placeholder="サービスタイプ名、説明で検索..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2" />
                                フィルター
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                検索
                            </button>
                        </form>

                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            カテゴリ
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) =>
                                                setData(
                                                    "category_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                すべてのカテゴリ
                                            </option>
                                            {serviceCategories.map(
                                                (category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            料金体系
                                        </label>
                                        <select
                                            value={data.pricing_model}
                                            onChange={(e) =>
                                                setData(
                                                    "pricing_model",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                すべての料金体系
                                            </option>
                                            {Object.entries(pricingModels).map(
                                                ([key, label]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ステータス
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                すべてのステータス
                                            </option>
                                            <option value="active">
                                                アクティブ
                                            </option>
                                            <option value="inactive">
                                                非アクティブ
                                            </option>
                                            <option value="featured">
                                                おすすめ
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 一括操作 */}
                    {selectedItems.length > 0 && (
                        <div className="p-4 bg-blue-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">
                                    {selectedItems.length}件選択中
                                </span>
                                <div className="flex items-center space-x-3">
                                    <select
                                        value={bulkAction}
                                        onChange={(e) =>
                                            setBulkAction(e.target.value)
                                        }
                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">一括操作を選択</option>
                                        <option value="activate">
                                            アクティブ化
                                        </option>
                                        <option value="deactivate">
                                            非アクティブ化
                                        </option>
                                        <option value="feature">
                                            おすすめに設定
                                        </option>
                                        <option value="unfeature">
                                            おすすめから除外
                                        </option>
                                        <option value="delete">削除</option>
                                    </select>
                                    <button
                                        onClick={handleBulkAction}
                                        disabled={!bulkAction}
                                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
                                    >
                                        実行
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* テーブル */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={
                                                serviceTypes?.data?.length >
                                                    0 &&
                                                selectedItems.length ===
                                                    serviceTypes.data.length
                                            }
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                        />
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("name")}
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
                                        onClick={() => handleSort("base_price")}
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
                                        onClick={() => handleSort("updated_at")}
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
                                {serviceTypes.data &&
                                serviceTypes.data.length > 0 ? (
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
                                                        toggleSelectItem(
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
                                                {
                                                    serviceType.service_category
                                                        ?.name
                                                }
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
                                                    title="詳細"
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
                                                    title="編集"
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
                                                    title="複製"
                                                >
                                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "削除しますか？"
                                                            )
                                                        ) {
                                                            router.delete(
                                                                route(
                                                                    "admin.service.service-types.destroy",
                                                                    serviceType.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="削除"
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
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            データがありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ページネーション */}
                    {serviceTypes.links &&
                        Array.isArray(serviceTypes.links) && (
                            <div className="px-6 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        {serviceTypes.from}〜{serviceTypes.to}件
                                        / 全{serviceTypes.total}件
                                    </div>
                                    <div className="flex space-x-1">
                                        {serviceTypes.links.map(
                                            (link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        link.url &&
                                                        router.get(link.url)
                                                    }
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        link.active
                                                            ? "bg-blue-600 text-white"
                                                            : link.url
                                                            ? "text-gray-700 hover:bg-gray-100"
                                                            : "text-gray-400 cursor-not-allowed"
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ServiceTypesIndex;
