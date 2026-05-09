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
            label: "すべて",
            count: stats?.all || serviceCategories.total,
        },
        {
            key: "without_trashed",
            label: "一覧",
            count: stats?.active || serviceCategories.total,
        },
        {
            key: "only_trashed",
            label: "削除済み",
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.status;

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
                {/* タブナビゲーション + 検索バー */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4">
                    {/* タブナビゲーション */}
                    <div className="flex-1">
                        <TabNavigation
                            tabs={tabs}
                            activeTab={activeTab}
                            onChange={handleTabChange}
                        />
                    </div>
                    {/* 検索バー */}
                    <div className="flex-1">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="カテゴリ名またはスラッグで検索..."
                            disabled={processing}
                        />
                    </div>
                </div>
                {/* フィルター */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FunnelIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            フィルター
                        </span>
                        {hasActiveFilters && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                フィルター中
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* ステータスフィルター */}
                        <FilterSelect
                            label="ステータス"
                            value={data.status}
                            onChange={(value) => setData("status", value)}
                            options={SERVICE_CATEGORY_STATUS_OPTIONS}
                            placeholder="すべてのステータス"
                        />

                        {/* スペーサー */}
                        <div className="hidden lg:block"></div>
                        <div className="hidden lg:block"></div>

                        {/* フィルタークリアボタン */}
                        <div className="flex items-end">
                            <SecondaryButton
                                onClick={handleClearFilters}
                                disabled={!hasActiveFilters}
                                size="md"
                                className="w-full"
                            >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                フィルタークリア
                            </SecondaryButton>
                        </div>
                    </div>
                </div>

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
                    <Card>
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索条件に一致するサービスカテゴリが見つかりませんでした。"
                                : activeTab === "only_trashed"
                                  ? "削除されたサービスカテゴリはありません。"
                                  : "まだサービスカテゴリが登録されていません。"}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.service.category.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                最初のサービスカテゴリを作成
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
