import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { CreateButton, SecondaryButton } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import { QUOTE_STATUS_OPTIONS } from "@/Constants/SelectOptions";
// Quote Components
import QuotesTable from "./_components/QuotesTable";

export default function Index({ quotes, filters, stats, statuses }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
        trashed: filters?.trashed || "without_trashed",
    });

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;

        router.get(route("admin.quote.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        router.get(
            route("admin.quote.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (quote) => {
        const confirmed = confirm(
            `${quote.title ? quote.title : "この見積もり"} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.quote.destroy", quote.id));
        }
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.quotes.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.quote.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.quotes.title}
                    description={PageConfig.quotes.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.quotes.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* ヘッダー */}
            <div className="w-full flex flex-col gap-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                フィルター
                            </button>
                        </div>
                    </div>
                </div>

                {/* 統計情報 */}
                {stats && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    総件数
                                </div>
                            </div>
                            {stats.by_status &&
                                Object.entries(statuses || {}).map(
                                    ([key, label]) => (
                                        <div key={key} className="text-center">
                                            <div
                                                className={`text-2xl font-bold ${
                                                    key === "draft"
                                                        ? "text-gray-600"
                                                        : key === "negotiating"
                                                          ? "text-blue-600"
                                                          : key === "approved" ||
                                                              key === "contracted"
                                                            ? "text-green-600"
                                                            : key === "rejected" ||
                                                                key === "cancelled"
                                                              ? "text-red-600"
                                                              : "text-gray-600"
                                                }`}
                                            >
                                                {stats.by_status[key] || 0}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {label}
                                            </div>
                                        </div>
                                    ),
                                )}
                        </div>
                        {stats.total_amount !== undefined && (
                            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                    合計金額:{" "}
                                    {new Intl.NumberFormat("ja-JP", {
                                        style: "currency",
                                        currency: "JPY",
                                    }).format(stats.total_amount)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* フィルター */}
                {showFilters && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    検索
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="見積番号、タイトル、クライアント名で検索"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ステータス
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">すべて</option>
                                    {QUOTE_STATUS_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    検索
                                </button>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    クリア
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* テーブル */}
            <QuotesTable quotes={quotes} onDelete={handleDelete} />

            {/* ページネーション */}
            {quotes.data.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <Pagination paginationData={quotes} />
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
