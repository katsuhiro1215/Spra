import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
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
import { SERVICE_CATEGORY_STATUS_OPTIONS } from "@/Constants/SelectOptions";
// ServiceCategory Components
import ServiceCategoriesTable from "./_components/ServiceCategoriesTable";

export default function Index({ serviceCategories, statuses, filters, stats }) {
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
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
            trashed: filters.trashed || "without_trashed",
        });
    }, [filters.trashed]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.status !== filters.status) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.service.category.index"),
            {
                search: data.search,
                status: data.status,
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
        get(route("admin.service.category.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            trashed: activeTab,
        });
        get(route("admin.service.category.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (category) => {
        setDeleteTarget(category);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.service.category.destroy", deleteTarget.id),
                {
                    onFinish: () => {
                        setIsDeleting(null);
                        setDeleteTarget(null);
                    },
                },
            );
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
            label: PageConfig.serviceCategories.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.category.create"),
        },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: PageConfig.serviceCategories.ui.tabs.all,
            count: stats?.all || serviceCategories.total,
        },
        {
            key: "without_trashed",
            label: PageConfig.serviceCategories.ui.tabs.list,
            count: stats?.active || serviceCategories.total,
        },
        {
            key: "only_trashed",
            label: PageConfig.serviceCategories.ui.tabs.trashed,
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.status;

    const activeFilterCount = [data.status].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.serviceCategories.title}
                    description={PageConfig.serviceCategories.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.serviceCategories.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.serviceCategories.documentTitle} />

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
                                    placeholder={PageConfig.serviceCategories.ui.search.placeholder}
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
                                    {PageConfig.serviceCategories.ui.filter.button}
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
                                    {/* ステータスフィルター */}
                                    <FilterSelect
                                        label={PageConfig.serviceCategories.filters.status.label}
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={
                                            SERVICE_CATEGORY_STATUS_OPTIONS
                                        }
                                        placeholder={PageConfig.serviceCategories.filters.status.placeholder}
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
                                            {PageConfig.serviceCategories.ui.filter.clear}
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* サービスカテゴリー一覧テーブル */}
                <ServiceCategoriesTable
                    serviceCategories={serviceCategories}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                {serviceCategories.data.length > 0 && (
                    <Pagination paginationData={serviceCategories} />
                )}

                {/* データがない場合 */}
                {serviceCategories.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? PageConfig.serviceCategories.ui.empty.noResults
                                : activeTab === "only_trashed"
                                  ? PageConfig.serviceCategories.ui.empty.noTrashed
                                  : PageConfig.serviceCategories.ui.empty.noData}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.service.category.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                {PageConfig.serviceCategories.ui.empty.createFirst}
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
