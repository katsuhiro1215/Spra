import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Button, CrudButton } from "@/Components/Buttons";
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
    const [showFilters, setShowFilters] = useState(false);

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
            count: stats?.all || admins.total,
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
                {/* 検索・フィルターカード */}
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
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.admins.ui.search.placeholder
                            }
                            disabled={processing}
                        />
                    </div>

                    {/* フィルタートグルボタン */}
                    <div className="flex-shrink-0">
                        <Button
                            variant="secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            size="md"
                            icon={FunnelIcon}
                            className="relative"
                        >
                            {PageConfig.admins.ui.filter.button}
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* フィルターセクション（折りたたみ可能）*/}
                {showFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* 役割フィルター */}
                            <FilterSelect
                                label={PageConfig.admins.filters.role.label}
                                value={data.role}
                                onChange={(value) => setData("role", value)}
                                options={ADMIN_ROLE_OPTIONS}
                                placeholder={
                                    PageConfig.admins.filters.role.placeholder
                                }
                            />

                            {/* ステータスフィルター */}
                            <FilterSelect
                                label={PageConfig.admins.filters.status.label}
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={ADMIN_STATUS_OPTIONS}
                                placeholder={
                                    PageConfig.admins.filters.status.placeholder
                                }
                            />

                            {/* スペーサー */}
                            <div className="hidden lg:block"></div>

                            {/* フィルタークリアボタン */}
                            <div className="flex items-end">
                                <Button
                                    variant="secondary"
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    icon={XMarkIcon}
                                    className="w-full"
                                >
                                    {PageConfig.admins.ui.filter.clear}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* テーブル */}
                <AdminsTable admins={admins} onDelete={handleDelete} />

                {/* ページネーション */}
                {admins.data.length > 0 && (
                    <Pagination paginationData={admins} />
                )}

                {/* データがない場合 */}
                {admins.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
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
