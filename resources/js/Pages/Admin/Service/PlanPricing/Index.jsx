import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
    CurrencyYenIcon,
    ClockIcon,
    ChartBarIcon,
    CogIcon,
    TagIcon,
} from "@heroicons/react/24/outline";

export default function PlanPricingIndex({
    servicePlan,
    planPricings,
    stats,
    filters,
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 検索・フィルター処理
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const params = Object.fromEntries(formData.entries());
        router.get(
            route("admin.service.plans.pricing.index", servicePlan.id),
            params,
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // フィルターリセット
    const resetFilters = () => {
        router.get(
            route("admin.service.plans.pricing.index", servicePlan.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // チェックボックス処理
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(planPricings.data.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // 一括削除
    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;

        if (
            confirm(
                `選択した${selectedItems.length}件の価格設定を削除しますか？`
            )
        ) {
            setIsProcessing(true);
            router.post(
                route(
                    "admin.service.plans.pricing.bulk-destroy",
                    servicePlan.id
                ),
                {
                    ids: selectedItems,
                },
                {
                    onFinish: () => {
                        setIsProcessing(false);
                        setSelectedItems([]);
                    },
                }
            );
        }
    };

    // アクティブ切り替え
    const toggleActive = (pricing) => {
        router.patch(
            route("admin.service.plans.pricing.toggle-active", [
                servicePlan.id,
                pricing.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // デフォルト設定
    const setDefault = (pricing) => {
        router.patch(
            route("admin.service.plans.pricing.set-default", [
                servicePlan.id,
                pricing.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // ステータスバッジ
    const getStatusBadge = (pricing) => {
        if (!pricing.is_active) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    非アクティブ
                </span>
            );
        }
        if (pricing.is_default) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <StarIcon className="w-3 h-3 mr-1" />
                    デフォルト
                </span>
            );
        }
        if (pricing.is_featured) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <StarIcon className="w-3 h-3 mr-1" />
                    注目
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                アクティブ
            </span>
        );
    };

    // タイプバッジ
    const getTypeBadge = (type) => {
        const badges = {
            base: "bg-blue-100 text-blue-800",
            addon: "bg-purple-100 text-purple-800",
            discount: "bg-red-100 text-red-800",
            tier: "bg-indigo-100 text-indigo-800",
        };

        const labels = {
            base: "基本価格",
            addon: "追加オプション",
            discount: "割引価格",
            tier: "段階料金",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    badges[type] || "bg-gray-100 text-gray-800"
                }`}
            >
                {labels[type] || type}
            </span>
        );
    };

    // 課金タイプバッジ
    const getBillingTypeBadge = (billingType) => {
        const badges = {
            fixed: "bg-green-100 text-green-800",
            per_unit: "bg-orange-100 text-orange-800",
            tiered: "bg-purple-100 text-purple-800",
            volume: "bg-indigo-100 text-indigo-800",
        };

        const labels = {
            fixed: "固定料金",
            per_unit: "単位料金",
            tiered: "段階料金",
            volume: "ボリューム料金",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    badges[billingType] || "bg-gray-100 text-gray-800"
                }`}
            >
                {labels[billingType] || billingType}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title={`価格設定管理 - ${servicePlan.name}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route(
                                "admin.service.plans.index",
                                servicePlan.service_type_id
                            )}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            プラン一覧に戻る
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                価格設定管理
                            </h1>
                            <p className="text-gray-600">
                                プラン: {servicePlan.name} (
                                {servicePlan.service_type?.name})
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route(
                                "admin.service.plans.pricing.create",
                                servicePlan.id
                            )}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            価格設定を追加
                        </Link>
                    </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TagIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        総価格設定数
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.total}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-8 w-8 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        アクティブ
                                    </dt>
                                    <dd className="text-lg font-medium text-green-900">
                                        {stats.active}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <EyeIcon className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        表示中
                                    </dt>
                                    <dd className="text-lg font-medium text-blue-900">
                                        {stats.visible}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <StarIcon className="h-8 w-8 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        デフォルト
                                    </dt>
                                    <dd className="text-lg font-medium text-yellow-900">
                                        {stats.default}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <StarIcon className="h-8 w-8 text-purple-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        注目設定
                                    </dt>
                                    <dd className="text-lg font-medium text-purple-900">
                                        {stats.featured}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 検索・フィルター */}
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        検索キーワード
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="search"
                                            defaultValue={filters.search || ""}
                                            placeholder="価格設定名、説明で検索..."
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        価格タイプ
                                    </label>
                                    <select
                                        name="type"
                                        defaultValue={filters.type || ""}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">すべて</option>
                                        <option value="base">基本価格</option>
                                        <option value="addon">
                                            追加オプション
                                        </option>
                                        <option value="discount">
                                            割引価格
                                        </option>
                                        <option value="tier">段階料金</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        課金タイプ
                                    </label>
                                    <select
                                        name="billing_type"
                                        defaultValue={
                                            filters.billing_type || ""
                                        }
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">すべて</option>
                                        <option value="fixed">固定料金</option>
                                        <option value="per_unit">
                                            単位料金
                                        </option>
                                        <option value="tiered">段階料金</option>
                                        <option value="volume">
                                            ボリューム料金
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ステータス
                                    </label>
                                    <select
                                        name="status"
                                        defaultValue={filters.status || ""}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">すべて</option>
                                        <option value="active">
                                            アクティブ
                                        </option>
                                        <option value="inactive">
                                            非アクティブ
                                        </option>
                                        <option value="visible">表示中</option>
                                        <option value="hidden">非表示</option>
                                        <option value="default">
                                            デフォルト
                                        </option>
                                        <option value="featured">
                                            注目設定
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <FunnelIcon className="w-4 h-4 mr-2" />
                                        フィルター適用
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        リセット
                                    </button>
                                </div>

                                {selectedItems.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBulkDelete}
                                        disabled={isProcessing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        選択項目を削除 ({selectedItems.length})
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* 価格設定一覧 */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            価格設定一覧 ({planPricings.total}件)
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedItems.length ===
                                                    planPricings.data.length &&
                                                planPricings.data.length > 0
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        価格設定名
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        タイプ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        価格
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        課金タイプ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        更新日
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {planPricings.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            価格設定が見つかりません。
                                            <Link
                                                href={route(
                                                    "admin.service.plans.pricing.create",
                                                    servicePlan.id
                                                )}
                                                className="text-blue-600 hover:text-blue-900 ml-1"
                                            >
                                                新しい価格設定を作成
                                            </Link>
                                            してください。
                                        </td>
                                    </tr>
                                ) : (
                                    planPricings.data.map((pricing) => (
                                        <tr
                                            key={pricing.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        pricing.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectItem(
                                                            pricing.id
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {pricing.display_name ||
                                                                pricing.name}
                                                        </div>
                                                        {pricing.description && (
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                {
                                                                    pricing.description
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getTypeBadge(pricing.type)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    ¥
                                                    {Number(
                                                        pricing.price
                                                    ).toLocaleString()}
                                                    {pricing.price_unit && (
                                                        <span className="text-gray-500 ml-1">
                                                            /{" "}
                                                            {pricing.price_unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getBillingTypeBadge(
                                                    pricing.billing_type
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(pricing)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    pricing.updated_at
                                                ).toLocaleDateString("ja-JP")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route(
                                                            "admin.service.plans.pricing.show",
                                                            [
                                                                servicePlan.id,
                                                                pricing.id,
                                                            ]
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.service.plans.pricing.edit",
                                                            [
                                                                servicePlan.id,
                                                                pricing.id,
                                                            ]
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            toggleActive(
                                                                pricing
                                                            )
                                                        }
                                                        className={`${
                                                            pricing.is_active
                                                                ? "text-red-600 hover:text-red-900"
                                                                : "text-green-600 hover:text-green-900"
                                                        }`}
                                                    >
                                                        {pricing.is_active ? (
                                                            <XCircleIcon className="w-4 h-4" />
                                                        ) : (
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setDefault(pricing)
                                                        }
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                        disabled={
                                                            pricing.is_default
                                                        }
                                                    >
                                                        <StarIcon
                                                            className={`w-4 h-4 ${
                                                                pricing.is_default
                                                                    ? "fill-current"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ページネーション */}
                    {planPricings.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {planPricings.from} - {planPricings.to} 件目
                                    (全 {planPricings.total} 件)
                                </div>
                                <div className="flex space-x-2">
                                    {planPricings.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : link.url
                                                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
