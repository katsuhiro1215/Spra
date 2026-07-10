import { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
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
import { ADMIN_STATUS_OPTIONS } from "@/Constants/SelectOptions";
// User Components
import UsersTable from "./_components/UsersTable";

export default function Index({ users, filters, stats }) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );
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

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status) {
            setShowFilters(true);
        }
    }, [data.status]);

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
            route("admin.user.index"),
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
        get(route("admin.user.index"), {
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
        setShowFilters(false);
        get(route("admin.user.index", { trashed: activeTab }), {
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
            router.delete(route("admin.user.destroy", admin.id));
        }
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.users.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.user.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "ユーザー一覧", href: null },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: PageConfig.users.ui.tabs.all,
            count: stats?.all || users.total,
        },
        {
            key: "without_trashed",
            label: PageConfig.users.ui.tabs.list,
            count: stats?.active || users.total,
        },
        {
            key: "only_trashed",
            label: PageConfig.users.ui.tabs.trashed,
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.status;

    const activeFilterCount = [data.status].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.users.title}
                    description={PageConfig.users.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.users.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

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
                                        PageConfig.users.ui.search.placeholder
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
                                    {PageConfig.users.ui.filter.button}
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
                                        label={
                                            PageConfig.users.filters.status
                                                .label
                                        }
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={ADMIN_STATUS_OPTIONS}
                                        placeholder={
                                            PageConfig.users.filters.status
                                                .placeholder
                                        }
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
                                            {PageConfig.users.ui.filter.clear}
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* ユーザー一覧テーブル */}
                <UsersTable users={users} onDelete={handleDelete} />

                {/* ページネーション */}
                {users.data.length > 0 && <Pagination paginationData={users} />}

                {/* データがない場合 */}
                {users.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            👤
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? PageConfig.users.ui.empty.noResults
                                : activeTab === "only_trashed"
                                  ? PageConfig.users.ui.empty.noTrashed
                                  : PageConfig.users.ui.empty.noData}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.user.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                {PageConfig.users.ui.empty.createFirst}
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
