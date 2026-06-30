import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import { CreateButton, SecondaryButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import {
    SERVICE_STATUS_OPTIONS,
    IS_FEATURED_OPTIONS,
} from "@/Constants/SelectOptions";
// Service Components
import ServicesTable from "./_components/ServicesTable";

export default function Index({
    services,
    statuses,
    categories,
    filters,
    stats,
}) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        category: filters.category || "",
        is_featured: filters.is_featured || "",
        trashed: filters.trashed || "without_trashed",
    });

    // ========================================
    // Effects
    // ========================================
    // propsが更新されたらstateも更新
    useEffect(() => {
        setActiveTab(filters.trashed || "without_trashed");
        setData({
            search: filters.search || "",
            status: filters.status || "",
            category: filters.category || "",
            is_featured: filters.is_featured || "",
            trashed: filters.trashed || "without_trashed",
        });
    }, [filters.trashed]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status || data.category || data.is_featured) {
            setShowFilters(true);
        }
    }, [data.status, data.category, data.is_featured]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.category !== filters.category ||
                data.is_featured !== filters.is_featured
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.category, data.is_featured]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.service.index"),
            {
                search: data.search,
                status: data.status,
                category: data.category,
                is_featured: data.is_featured,
                trashed: tab,
            },
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.service.index"), {
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
            is_featured: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.service.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (service) => {
        setDeleteTarget(service);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(route("admin.service.destroy", deleteTarget.id), {
                onFinish: () => {
                    setIsDeleting(null);
                    setDeleteTarget(null);
                },
            });
        }
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.services.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.create"),
        },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: PageConfig.services.ui.tabs.all,
            count: stats?.all || services.total,
        },
        {
            key: "without_trashed",
            label: PageConfig.services.ui.tabs.list,
            count: stats?.active || services.total,
        },
        {
            key: "only_trashed",
            label: PageConfig.services.ui.tabs.trashed,
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters =
        data.search || data.status || data.category || data.is_featured;

    const activeFilterCount = [
        data.status,
        data.category,
        data.is_featured,
    ].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.services.title}
                    description={PageConfig.services.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.services.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.services.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 削除アラート */}
            <DeleteAlert
                show={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                <Card>
                    <div className="p-4 space-y-3">
                        {/* タブ + 検索 + フィルタートグル */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            {/* タブナビゲーション */}
                            <div className="flex-shrink-0">
                                <TabNavigation
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    onChange={handleTabChange}
                                />
                            </div>

                            {/* 検索バー */}
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) =>
                                        setData("search", value)
                                    }
                                    onSearch={handleSearch}
                                    placeholder={
                                        PageConfig.services.ui.search
                                            .placeholder
                                    }
                                    disabled={processing}
                                />
                            </div>

                            {/* フィルタートグルボタン */}
                            <div className="flex-shrink-0">
                                <SecondaryButton
                                    onClick={() => setShowFilters(!showFilters)}
                                    size="sm"
                                    className="relative"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    {PageConfig.services.ui.filter.button}
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </SecondaryButton>
                            </div>
                        </div>

                        {/* フィルターセクション（折りたたみ可能）*/}
                        {showFilters && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {/* カテゴリフィルター */}
                                    <FilterSelect
                                        label={
                                            PageConfig.services.filters.category
                                                .label
                                        }
                                        value={data.category}
                                        onChange={(value) =>
                                            setData("category", value)
                                        }
                                        options={
                                            categories?.map((cat) => ({
                                                value: cat.id,
                                                label: cat.name,
                                            })) || []
                                        }
                                        placeholder={
                                            PageConfig.services.filters.category
                                                .placeholder
                                        }
                                    />

                                    {/* ステータスフィルター */}
                                    <FilterSelect
                                        label={
                                            PageConfig.services.filters.status
                                                .label
                                        }
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={SERVICE_STATUS_OPTIONS}
                                        placeholder={
                                            PageConfig.services.filters.status
                                                .placeholder
                                        }
                                    />

                                    {/* 注目フィルター */}
                                    <FilterSelect
                                        label={
                                            PageConfig.services.filters.featured
                                                .label
                                        }
                                        value={data.is_featured}
                                        onChange={(value) =>
                                            setData("is_featured", value)
                                        }
                                        options={IS_FEATURED_OPTIONS}
                                        placeholder={
                                            PageConfig.services.filters.featured
                                                .placeholder
                                        }
                                    />

                                    {/* フィルタークリアボタン */}
                                    <div className="flex items-end">
                                        <SecondaryButton
                                            onClick={handleClearFilters}
                                            disabled={!hasActiveFilters}
                                            size="md"
                                            className="w-full"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            {
                                                PageConfig.services.ui.filter
                                                    .clear
                                            }
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* サービス一覧テーブル */}
                <ServicesTable services={services} onDelete={handleDelete} />

                {/* ページネーション */}
                {services.data.length > 0 && (
                    <Pagination paginationData={services} />
                )}

                {/* データがない場合 */}
                {services.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? PageConfig.services.ui.empty.noResults
                                : activeTab === "only_trashed"
                                  ? PageConfig.services.ui.empty.noTrashed
                                  : PageConfig.services.ui.empty.noData}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.service.create")}
                                size="md"
                            >
                                {PageConfig.services.ui.empty.createFirst}
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
