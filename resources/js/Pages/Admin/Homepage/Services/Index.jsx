import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
    CurrencyYenIcon,
    TagIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function Index({ services, serviceCategories, filters }) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [currentFilters, setCurrentFilters] = useState({
        category: filters.category || "",
        status: filters.status || "",
    });

    const handleDelete = (service) => {
        if (
            confirm(
                `「${service.name}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            setIsDeleting(service.id);
            router.delete(route("admin.homepage.services.destroy", service), {
                onFinish: () => setIsDeleting(null),
            });
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...currentFilters, [key]: value };
        setCurrentFilters(newFilters);

        // 空の値は除外してクエリパラメータを構築
        const queryParams = Object.fromEntries(
            Object.entries(newFilters).filter(([_, v]) => v !== "")
        );

        router.get(route("admin.homepage.services.index"), queryParams, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setCurrentFilters({ category: "", status: "" });
        router.get(
            route("admin.homepage.services.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const formatPrice = (pricing) => {
        if (!pricing || pricing.length === 0) return "お問い合わせ";

        const minPrice = Math.min(
            ...pricing.map((p) => p.price).filter((p) => p > 0)
        );
        if (minPrice === Infinity) return "お問い合わせ";

        return `¥${minPrice.toLocaleString()}〜`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        サービス管理
                    </h2>
                    <Link
                        href={route("admin.homepage.services.create")}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        新規作成
                    </Link>
                </div>
            }
        >
            <Head title="サービス管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* フィルター */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <FunnelIcon className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    フィルター
                                </h3>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        カテゴリ
                                    </label>
                                    <select
                                        value={currentFilters.category}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "category",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">
                                            すべてのカテゴリ
                                        </option>
                                        {serviceCategories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ステータス
                                    </label>
                                    <select
                                        value={currentFilters.status}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">
                                            すべてのステータス
                                        </option>
                                        <option value="active">
                                            アクティブ
                                        </option>
                                        <option value="featured">
                                            おすすめ
                                        </option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        クリア
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {services.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 mb-4">
                                        {Object.values(currentFilters).some(
                                            (v) => v !== ""
                                        )
                                            ? "フィルター条件に一致するサービスがありません"
                                            : "サービスが登録されていません"}
                                    </div>
                                    <Link
                                        href={route(
                                            "admin.homepage.services.create"
                                        )}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        最初のサービスを作成
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            {/* サービスヘッダー */}
                                            <div className="p-4 border-b border-gray-100">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                                                {service.name}
                                                            </h3>
                                                            {service.is_featured && (
                                                                <StarIconSolid className="h-5 w-5 text-yellow-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <TagIcon className="h-4 w-4 text-gray-400" />
                                                            <span
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                                                                style={{
                                                                    backgroundColor:
                                                                        service
                                                                            .service_category
                                                                            ?.color ||
                                                                        "#6B7280",
                                                                }}
                                                            >
                                                                {service
                                                                    .service_category
                                                                    ?.name ||
                                                                    "未分類"}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {
                                                                service.description
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center ml-3">
                                                        {service.is_active ? (
                                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* サービス詳細 */}
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-1">
                                                        <CurrencyYenIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatPrice(
                                                                service.pricing
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(
                                                            service.created_at
                                                        )}
                                                    </span>
                                                </div>

                                                {/* 技術スタック */}
                                                {service.technologies &&
                                                    service.technologies
                                                        .length > 0 && (
                                                        <div className="mb-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {service.technologies
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            tech,
                                                                            index
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700"
                                                                            >
                                                                                {
                                                                                    tech
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                {service
                                                                    .technologies
                                                                    .length >
                                                                    3 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-500">
                                                                        +
                                                                        {service
                                                                            .technologies
                                                                            .length -
                                                                            3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* アクションボタン */}
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route(
                                                            "admin.homepage.services.show",
                                                            service
                                                        )}
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <EyeIcon className="h-4 w-4 mr-1" />
                                                        詳細
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.homepage.services.edit",
                                                            service
                                                        )}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <PencilIcon className="h-4 w-4 mr-1" />
                                                        編集
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                service
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ===
                                                            service.id
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        <TrashIcon className="h-4 w-4 mr-1" />
                                                        {isDeleting ===
                                                        service.id
                                                            ? "削除中..."
                                                            : "削除"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
