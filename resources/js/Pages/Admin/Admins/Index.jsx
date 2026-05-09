import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
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
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import {
    ADMIN_ROLE_OPTIONS,
    ADMIN_STATUS_OPTIONS,
} from "@/Constants/SelectOptions";
// Admin Components
import AdminsTable from "./_components/AdminsTable";

export default function Index({ admins, filters, stats }) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        role: filters.role || "",
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
            role: filters.role || "",
            status: filters.status || "",
            trashed: filters.trashed || "without_trashed",
        });
    }, [filters.trashed]);

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
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.admins.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.admin.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "管理者一覧", href: null },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: "すべて",
            count: stats?.all || admins.total,
        },
        {
            key: "without_trashed",
            label: "一覧",
            count: stats?.active || admins.total,
        },
        { key: "only_trashed", label: "削除済み", count: stats?.trashed || 0 },
    ];

    const hasActiveFilters = data.search || data.role || data.status;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.admins.title}
                    description={PageConfig.admins.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.admins.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

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
                            placeholder="ユーザー名またはメールアドレスで検索..."
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
                        {/* 役割フィルター */}
                        <FilterSelect
                            label="役割"
                            value={data.role}
                            onChange={(value) => setData("role", value)}
                            options={ADMIN_ROLE_OPTIONS}
                            placeholder="すべての役割"
                        />

                        {/* ステータスフィルター */}
                        <FilterSelect
                            label="ステータス"
                            value={data.status}
                            onChange={(value) => setData("status", value)}
                            options={ADMIN_STATUS_OPTIONS}
                            placeholder="すべてのステータス"
                        />

                        {/* スペーサー */}
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

                {/* テーブル */}
                <AdminsTable admins={admins} onDelete={handleDelete} />

                {/* ページネーション */}
                {admins.data.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                        <Pagination paginationData={admins} />
                    </div>
                )}

                {/* データがない場合 */}
                {admins.data.length === 0 && (
                    <Card>
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索条件に一致する管理者が見つかりませんでした。"
                                : activeTab === "only_trashed"
                                  ? "削除された管理者はいません。"
                                  : "まだ管理者が登録されていません。"}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.admin.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                最初の管理者を作成
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
