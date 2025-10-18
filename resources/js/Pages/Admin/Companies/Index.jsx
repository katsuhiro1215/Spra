import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function CompanyIndex({
    companies,
    stats,
    prefectures,
    filters,
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 検索フォーム処理
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchParams = Object.fromEntries(formData.entries());

        router.get(route("admin.companies.index"), searchParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルターリセット
    const handleReset = () => {
        router.get(
            route("admin.companies.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // 全選択
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(companies.data.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    // 個別選択
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
            confirm(`選択した${selectedItems.length}件の会社を削除しますか？`)
        ) {
            setIsProcessing(true);
            router.post(
                route("admin.companies.bulk-destroy"),
                { ids: selectedItems },
                {
                    onSuccess: () => {
                        setSelectedItems([]);
                        setIsProcessing(false);
                    },
                    onError: () => {
                        setIsProcessing(false);
                    },
                }
            );
        }
    };

    // ステータス切り替え
    const toggleStatus = (company) => {
        router.patch(
            route("admin.companies.toggle-status", company.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // 削除
    const handleDelete = (company) => {
        if (confirm(`${company.name} を削除しますか？`)) {
            router.delete(route("admin.companies.destroy", company.id));
        }
    };

    // ステータスバッジ
    const getStatusBadge = (company) => {
        const badges = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            suspended: "bg-red-100 text-red-800",
        };

        const icons = {
            active: CheckCircleIcon,
            inactive: XCircleIcon,
            suspended: XCircleIcon,
        };

        const IconComponent = icons[company.status] || CheckCircleIcon;

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    badges[company.status] || "bg-gray-100 text-gray-800"
                }`}
            >
                <IconComponent className="w-3 h-3 mr-1" />
                {company.status_name}
            </span>
        );
    };

    // 会社タイプバッジ
    const getTypeBadge = (type) => {
        const badges = {
            individual: "bg-blue-100 text-blue-800",
            corporate: "bg-purple-100 text-purple-800",
        };

        const labels = {
            individual: "個人",
            corporate: "法人",
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

    return (
        <AdminLayout>
            <Head title="会社管理" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title="会社管理"
                        description="会社・組織の情報を管理します"
                        actions={[
                            {
                                label: "会社を追加",
                                href: route("admin.companies.create"),
                                variant: "primary",
                                icon: PlusIcon,
                            },
                        ]}
                    />

                    <div className="mt-6 space-y-6">
                        {/* 統計情報 */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                総会社数
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
                                        <UserGroupIcon className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                個人
                                            </dt>
                                            <dd className="text-lg font-medium text-blue-900">
                                                {stats.individual}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BuildingOfficeIcon className="h-8 w-8 text-purple-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                法人
                                            </dt>
                                            <dd className="text-lg font-medium text-purple-900">
                                                {stats.corporate}
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
                                        <XCircleIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                非アクティブ
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {stats.inactive}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 検索・フィルター */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-6">
                                <form
                                    onSubmit={handleSearch}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                検索キーワード
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="search"
                                                    defaultValue={
                                                        filters.search || ""
                                                    }
                                                    placeholder="会社名、代表者名で検索..."
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                会社タイプ
                                            </label>
                                            <select
                                                name="company_type"
                                                defaultValue={
                                                    filters.company_type || ""
                                                }
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">すべて</option>
                                                <option value="individual">
                                                    個人
                                                </option>
                                                <option value="corporate">
                                                    法人
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ステータス
                                            </label>
                                            <select
                                                name="status"
                                                defaultValue={
                                                    filters.status || ""
                                                }
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">すべて</option>
                                                <option value="active">
                                                    アクティブ
                                                </option>
                                                <option value="inactive">
                                                    非アクティブ
                                                </option>
                                                <option value="suspended">
                                                    停止中
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                都道府県
                                            </label>
                                            <select
                                                name="prefecture"
                                                defaultValue={
                                                    filters.prefecture || ""
                                                }
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">すべて</option>
                                                {prefectures.map(
                                                    (prefecture) => (
                                                        <option
                                                            key={prefecture}
                                                            value={prefecture}
                                                        >
                                                            {prefecture}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md"
                                            >
                                                リセット
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                検索
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* 一括操作 */}
                        {selectedItems.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-blue-800">
                                        {selectedItems.length}
                                        件の項目が選択されています
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleBulkDelete}
                                        disabled={isProcessing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        選択項目を削除 ({selectedItems.length})
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 会社一覧 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    会社一覧 ({companies.total}件)
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
                                                            companies.data
                                                                .length &&
                                                        companies.data.length >
                                                            0
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                会社名
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                タイプ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                代表者
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                住所
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ステータス
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                登録日
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {companies.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-6 py-12 text-center text-gray-500"
                                                >
                                                    会社が見つかりません。上部の「会社を追加」ボタンから新しい会社を登録してください。
                                                </td>
                                            </tr>
                                        ) : (
                                            companies.data.map((company) => (
                                                <tr
                                                    key={company.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(
                                                                company.id
                                                            )}
                                                            onChange={() =>
                                                                handleSelectItem(
                                                                    company.id
                                                                )
                                                            }
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        company.display_name
                                                                    }
                                                                </div>
                                                                {company.legal_name &&
                                                                    company.legal_name !==
                                                                        company.name && (
                                                                        <div className="text-sm text-gray-500">
                                                                            {
                                                                                company.legal_name
                                                                            }
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getTypeBadge(
                                                            company.company_type
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {
                                                                company.representative_name
                                                            }
                                                        </div>
                                                        {company.representative_title && (
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    company.representative_title
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {company.prefecture}{" "}
                                                            {company.city}
                                                        </div>
                                                        {company.phone && (
                                                            <div className="text-sm text-gray-500">
                                                                {company.phone}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            company
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(
                                                            company.created_at
                                                        ).toLocaleDateString(
                                                            "ja-JP"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.companies.show",
                                                                    company.id
                                                                )}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "admin.companies.edit",
                                                                    company.id
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    toggleStatus(
                                                                        company
                                                                    )
                                                                }
                                                                className={`${
                                                                    company.status ===
                                                                    "active"
                                                                        ? "text-red-600 hover:text-red-900"
                                                                        : "text-green-600 hover:text-green-900"
                                                                }`}
                                                            >
                                                                {company.status ===
                                                                "active" ? (
                                                                    <XCircleIcon className="w-4 h-4" />
                                                                ) : (
                                                                    <CheckCircleIcon className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        company
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
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
                            {companies.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            {companies.from} - {companies.to}{" "}
                                            件目 (全 {companies.total} 件)
                                        </div>
                                        <div className="flex space-x-2">
                                            {companies.links.map(
                                                (link, index) => (
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
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
