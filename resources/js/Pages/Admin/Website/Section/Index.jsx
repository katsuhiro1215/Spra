import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { Badge } from "@/Components/Badges";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import SectionsTable from "./_components/SectionsTable";

export default function Index({ sections, stats, pages, filters }) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(filters.trashed || "without");
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        page_id: filters.page_id || "",
        role: filters.role || "",
        trashed: filters.trashed || "without",
    });

    // ========================================
    // Effects
    // ========================================
    // propsが更新されたらstateも更新
    useEffect(() => {
        setActiveTab(filters.trashed || "without");
        setData({
            search: filters.search || "",
            page_id: filters.page_id || "",
            role: filters.role || "",
            trashed: filters.trashed || "without",
        });
    }, [filters.trashed]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.page_id || data.role) {
            setShowFilters(true);
        }
    }, [data.page_id, data.role]);

    // 検索のデバウンス
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (data.search !== filters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [data.search]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.website.section.index"),
            {
                search: data.search,
                page_id: data.page_id,
                role: data.role,
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
        get(route("admin.website.section.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            page_id: "",
            role: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.website.section.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (section) => {
        if (confirm(`セクション「${section.name}」を削除しますか？`)) {
            router.delete(route("admin.website.section.destroy", section.id), {
                preserveScroll: true,
            });
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.sections.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.section.create"),
        },
    ];

    const PageOptions = [
        { value: "", label: "すべてのページ" },
        ...pages.map((page) => ({
            value: page.id,
            label: page.title,
        })),
    ];

    const tabs = [
        {
            key: "with",
            label: "すべて",
            count: stats?.total || sections.total,
        },
        {
            key: "without",
            label: "有効",
            count: stats?.active || sections.total,
        },
        {
            key: "only",
            label: "削除済み",
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.page_id || data.role;
    const activeFilterCount = [data.page_id, data.role].filter(Boolean).length;

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.sections.title}
                    description={PageConfig.sections.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.sections.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.sections.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全セクション
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            有効
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.active}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            削除済み
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.trashed}
                        </div>
                    </div>
                </div>

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
                                    placeholder="セクション名、役割で検索..."
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
                                    フィルター
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </SecondaryButton>
                            </div>
                        </div>

                        {/* フィルターパネル */}
                        {showFilters && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FilterSelect
                                        label="ページ"
                                        value={data.page_id}
                                        onChange={(value) =>
                                            setData("page_id", value)
                                        }
                                        options={PageOptions}
                                    />

                                    <div className="flex items-end">
                                        <SecondaryButton
                                            onClick={handleClearFilters}
                                            disabled={!hasActiveFilters}
                                            size="md"
                                            className="w-full"
                                        >
                                            クリア
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* セクション一覧 */}
                <SectionsTable sections={sections} onDelete={handleDelete} />

                {/* ページネーション */}
                <Pagination paginator={sections} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
