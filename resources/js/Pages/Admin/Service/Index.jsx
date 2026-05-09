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
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

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
            label: "サービスを追加",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス一覧管理", href: null },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: "すべて",
            count: stats?.all || services.total,
        },
        {
            key: "without_trashed",
            label: "一覧",
            count: stats?.active || services.total,
        },
        {
            key: "only_trashed",
            label: "削除済み",
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters =
        data.search || data.status || data.category || data.is_featured;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービス管理"
                    description="サービスの作成、編集、削除を行います"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="サービス管理" />

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
                            placeholder="サービス名またはスラッグで検索..."
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
                        {/* カテゴリフィルター */}
                        <FilterSelect
                            label="カテゴリ"
                            value={data.category}
                            onChange={(value) => setData("category", value)}
                            options={
                                categories?.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                })) || []
                            }
                            placeholder="すべてのカテゴリ"
                        />

                        {/* ステータスフィルター */}
                        <FilterSelect
                            label="ステータス"
                            value={data.status}
                            onChange={(value) => setData("status", value)}
                            options={SERVICE_STATUS_OPTIONS}
                            placeholder="すべてのステータス"
                        />

                        {/* 注目フィルター */}
                        <FilterSelect
                            label="注目"
                            value={data.is_featured}
                            onChange={(value) => setData("is_featured", value)}
                            options={IS_FEATURED_OPTIONS}
                            placeholder="すべて"
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
                                フィルタークリア
                            </SecondaryButton>
                        </div>
                    </div>
                </div>

                {/* サービス一覧テーブル */}
                <ServicesTable services={services} onDelete={handleDelete} />

                {/* ページネーション */}
                {services.data.length > 0 && (
                    <Pagination paginationData={services} />
                )}

                {/* データがない場合 */}
                {services.data.length === 0 && (
                    <Card>
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索条件に一致するサービスが見つかりませんでした。"
                                : activeTab === "only_trashed"
                                  ? "削除されたサービスはありません。"
                                  : "まだサービスが登録されていません。"}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.service.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                最初のサービスを作成
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
