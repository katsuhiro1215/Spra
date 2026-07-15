import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import ResponseTemplateTable from "./_components/ResponseTemplateTable";
// Icons
import { XMarkIcon, FunnelIcon, PlusIcon } from "@heroicons/react/24/outline";
// Page Config
import { PageConfig } from "@/Constants/PageConfig";

const toOptions = (obj = {}) =>
    Object.entries(obj).map(([value, label]) => ({ value, label }));

export default function Index({
    templates = {},
    filters = {},
    statuses = {},
    categories = {},
}) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        category: filters.category || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status || data.category) {
            setShowFilters(true);
        }
    }, [data.status, data.category]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.category !== filters.category
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.category]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.response.template.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            category: "",
        });
        setShowFilters(false);
        get(route("admin.response.template.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.responseTemplates.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.response.template.create"),
        },
    ];

    // ========================================
    // Constants - Options & Config
    // ========================================
    const statusOptions = toOptions(statuses);
    const categoryOptions = toOptions(categories);

    const hasActiveFilters = data.status || data.category;
    const activeFilterCount = [data.status, data.category].filter(
        Boolean,
    ).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.responseTemplates.title}
                    description={PageConfig.responseTemplates.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.responseTemplates.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.responseTemplates.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                {/* 検索バー + フィルタートグル + 作成ボタン */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* 検索バー */}
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.responseTemplates.ui.search
                                    .placeholder
                            }
                            disabled={processing}
                        />
                    </div>

                    {/* フィルター・作成ボタン */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                                hasActiveFilters
                                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                            }`}
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            フィルター
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* フィルター展開エリア */}
                {showFilters && (
                    <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) =>
                                    setData("status", value)
                                }
                                options={statusOptions}
                            />
                            <FilterSelect
                                label="カテゴリ"
                                value={data.category}
                                onChange={(value) =>
                                    setData("category", value)
                                }
                                options={categoryOptions}
                            />
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    className="w-full"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    フィルターをクリア
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* 一覧テーブル */}
                <ResponseTemplateTable templates={templates} />

                {/* ページネーション */}
                {templates.data && templates.data.length > 0 && (
                    <Pagination paginationData={templates} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
