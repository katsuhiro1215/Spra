import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import QuotesTable from "./_components/QuotesTable";

const STATUS_AMOUNT_COLORS = {
    draft: "text-slate-600 dark:text-slate-400",
    negotiating: "text-blue-600 dark:text-blue-400",
    approved: "text-green-600 dark:text-green-400",
    contracted: "text-green-600 dark:text-green-400",
    rejected: "text-red-600 dark:text-red-400",
    cancelled: "text-slate-600 dark:text-slate-400",
};

export default function Index({
    quotes,
    filters = {},
    stats = {},
    statuses = {},
}) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(
        !!filters?.status,
    );

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
    });

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.quote.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({ search: "", status: "" });
        setShowFilters(false);
        get(route("admin.quote.index"), {
            preserveState: true,
            preserveScroll: true,
        });
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
    // Constants - Header Actions & Filters
    // ========================================
    const headerActions = [
        {
            label: PageConfig.quotes.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.quote.create"),
        },
    ];

    const statusOptions = Object.entries(statuses).map(([value, label]) => ({
        value,
        label,
    }));

    const hasActiveFilters = data.search || data.status;
    const activeFilterCount = data.status ? 1 : 0;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.quotes.title}
                    description={PageConfig.quotes.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.quotes.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.quotes.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索 + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.quotes.ui.search.placeholder
                            }
                            disabled={processing}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <SecondaryButton
                            onClick={() => setShowFilters(!showFilters)}
                            size="md"
                            icon={FunnelIcon}
                            className="relative"
                            aria-expanded={showFilters}
                        >
                            {PageConfig.quotes.ui.filter.button}
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </SecondaryButton>
                    </div>
                </div>

                {/* フィルターセクション */}
                {showFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={statusOptions}
                            />
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    icon={XMarkIcon}
                                    className="w-full"
                                >
                                    {PageConfig.quotes.ui.filter.clear}
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* 統計情報 */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    総件数
                                </div>
                            </div>
                        </Card>
                        {Object.entries(statuses).map(([key, label]) => (
                            <Card key={key}>
                                <div className="p-4 text-center">
                                    <div
                                        className={`text-2xl font-bold ${
                                            STATUS_AMOUNT_COLORS[key] ||
                                            "text-slate-600 dark:text-slate-400"
                                        }`}
                                    >
                                        {stats.by_status?.[key] || 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {label}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {stats?.total_amount !== undefined && (
                    <Card>
                        <div className="p-4 text-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
                                合計金額:
                            </span>
                            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {new Intl.NumberFormat("ja-JP", {
                                    style: "currency",
                                    currency: "JPY",
                                }).format(stats.total_amount)}
                            </span>
                        </div>
                    </Card>
                )}

                {/* テーブル */}
                <QuotesTable quotes={quotes} onDelete={handleDelete} />

                {/* ページネーション */}
                {quotes.data.length > 0 && (
                    <Pagination paginationData={quotes} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
