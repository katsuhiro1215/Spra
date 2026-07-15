import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { CrudButton, IconButton } from "@/Components/Buttons";
import {
    PlusIcon,
    ListBulletIcon,
    Squares2X2Icon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import AdminsFilterBar from "./_components/AdminsFilterBar";
import AdminsTable from "./_components/AdminsTable";
import AdminsGrid from "./_components/AdminsGrid";

const DEFAULT_TRASHED = "without_trashed";
const VIEW_MODE_STORAGE_KEY = "admins-view-mode";

// filters props からフォームの初期値/リセット値を組み立てる
const buildFilterState = (filters) => ({
    search: filters.search || "",
    role: filters.role || "",
    status: filters.status || "",
    trashed: filters.trashed || DEFAULT_TRASHED,
});

export default function Index({ admins, filters, stats }) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(
        filters.trashed || DEFAULT_TRASHED,
    );
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState(
        () => localStorage.getItem(VIEW_MODE_STORAGE_KEY) || "table",
    );

    const { data, setData, get, processing } = useForm(
        buildFilterState(filters),
    );

    // ========================================
    // Effects
    // ========================================
    // propsが更新されたらstateも更新
    useEffect(() => {
        setActiveTab(filters.trashed || DEFAULT_TRASHED);
        setData(buildFilterState(filters));
    }, [filters.trashed]);

    // 表示モード（テーブル/グリッド）を記憶
    useEffect(() => {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }, [viewMode]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.role || data.status) {
            setShowFilters(true);
        }
    }, [data.role, data.status]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.role !== filters.role || data.status !== filters.status) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.role, data.status]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.admin.index"),
            {
                search: data.search,
                role: data.role,
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
        get(route("admin.admin.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            role: "",
            status: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.admin.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (admin) => {
        const confirmed = confirm(
            `${admin.profile ? admin.profile.last_name : admin.email} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.admin.destroy", admin.id));
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.admins.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.admin.create"),
        },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: PageConfig.admins.ui.tabs.all,
            count: stats?.total || admins.total,
        },
        {
            key: "without_trashed",
            label: PageConfig.admins.ui.tabs.list,
            count: stats?.active || admins.total,
        },
        {
            key: "only_trashed",
            label: PageConfig.admins.ui.tabs.trashed,
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.role || data.status;

    const activeFilterCount = [data.role, data.status].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.admins.title}
                    description={PageConfig.admins.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.admins.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.admins.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターツールバー */}
                <AdminsFilterBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    data={data}
                    setData={setData}
                    onSearch={handleSearch}
                    searchDisabled={processing}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    activeFilterCount={activeFilterCount}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                {admins.data.length > 0 ? (
                    <>
                        {/* 統計情報 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats?.total ?? admins.total}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        総数
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {stats?.active ?? 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        アクティブ
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                                        {stats?.inactive ?? 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        非アクティブ
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {stats?.suspended ?? 0}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        停止中
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 一覧ヘッダー（件数 + 表示切替） */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                管理者一覧 ({admins.total}件)
                            </h2>
                            <div className="flex gap-1">
                                <IconButton
                                    variant={
                                        viewMode === "table"
                                            ? "secondary"
                                            : "text"
                                    }
                                    icon={ListBulletIcon}
                                    onClick={() => setViewMode("table")}
                                    title="テーブル表示"
                                />
                                <IconButton
                                    variant={
                                        viewMode === "grid"
                                            ? "secondary"
                                            : "text"
                                    }
                                    icon={Squares2X2Icon}
                                    onClick={() => setViewMode("grid")}
                                    title="グリッド表示"
                                />
                            </div>
                        </div>

                        {/* テーブル / グリッド */}
                        {viewMode === "table" ? (
                            <AdminsTable
                                admins={admins}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <AdminsGrid
                                admins={admins}
                                onDelete={handleDelete}
                            />
                        )}

                        {/* ページネーション */}
                        <Pagination paginationData={admins} />
                    </>
                ) : (
                    /* データがない場合 */
                    <Card className="text-center py-12">
                        <UserGroupIcon className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? PageConfig.admins.ui.empty.noResults
                                : activeTab === "only_trashed"
                                  ? PageConfig.admins.ui.empty.noTrashed
                                  : PageConfig.admins.ui.empty.noData}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CrudButton
                                action="create"
                                useTheme
                                href={route("admin.admin.create")}
                                size="md"
                                icon={PlusIcon}
                            >
                                {PageConfig.admins.ui.empty.createFirst}
                            </CrudButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
