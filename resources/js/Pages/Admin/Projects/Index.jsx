import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { CreateButton, SecondaryButton } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
// Project Components
import ProjectsTable from "./_components/ProjectsTable";

export default function Index({
    projects,
    filters = {},
    categories = [],
    admins = [],
    stats,
}) {
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );
    const [showFilters, setShowFilters] = useState(false);

    // ========================================
    // State & Form
    // ========================================
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        priority: filters.priority || "",
        category_id: filters.category_id || "",
        admin_id: filters.admin_id || "",
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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.priority !== filters.priority ||
                data.category_id !== filters.category_id ||
                data.admin_id !== filters.admin_id
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.priority, data.category_id, data.admin_id]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        router.get(
            route("admin.project.index"),
            {
                search: data.search,
                status: data.status,
                priority: data.priority,
                category_id: data.category_id,
                admin_id: data.admin_id,
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
        get(route("admin.project.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            priority: "",
            category_id: "",
            admin_id: "",
        });
        get(route("admin.project.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (project) => {
        const confirmed = confirm(
            `${project.title} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.project.destroy", project.id));
        }
    };

    // ========================================
    // Constants
    // ========================================
    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.project.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "プロジェクト", href: null },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: "すべて",
            count: stats?.all || projects.total,
        },
        {
            key: "without_trashed",
            label: "一覧",
            count: stats?.active || projects.total,
        },
        {
            key: "only_trashed",
            label: "削除済み",
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters =
        data.search ||
        data.status ||
        data.priority ||
        data.category_id ||
        data.admin_id;

    const activeFilterCount = [
        data.status,
        data.priority,
        data.category_id,
        data.admin_id,
    ].filter(Boolean).length;

    const statusOptions = [
        { value: "", label: "すべて" },
        { value: "planning", label: "計画中" },
        { value: "design", label: "デザイン中" },
        { value: "development", label: "開発中" },
        { value: "testing", label: "テスト中" },
        { value: "review", label: "レビュー中" },
        { value: "completed", label: "完了" },
        { value: "on_hold", label: "保留" },
        { value: "cancelled", label: "キャンセル" },
    ];

    const priorityOptions = [
        { value: "", label: "すべて" },
        { value: "low", label: "低" },
        { value: "medium", label: "中" },
        { value: "high", label: "高" },
        { value: "urgent", label: "緊急" },
    ];

    const categoryOptions = [
        { value: "", label: "すべて" },
        ...categories.map((category) => ({
            value: category.id,
            label: category.name,
        })),
    ];

    const adminOptions = [
        { value: "", label: "すべて" },
        ...admins.map((admin) => ({
            value: admin.id,
            label: admin.name,
        })),
    ];

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロジェクト"
                    description="プロジェクトの管理"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクト一覧" />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                <Card>
                    <div className="p-4 space-y-4">
                        {/* タブ + 検索 + フィルタートグル */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
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
                                    placeholder="サービス名またはスラッグで検索..."
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

                        {/* フィルターセクション（折りたたみ可能）*/}
                        {showFilters && (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {/* カテゴリフィルター */}
                                    <FilterSelect
                                        label="カテゴリ"
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
                                        placeholder="すべて"
                                    />

                                    {/* ステータスフィルター */}
                                    <FilterSelect
                                        label="ステータス"
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={SERVICE_STATUS_OPTIONS}
                                        placeholder="すべて"
                                    />

                                    {/* 注目フィルター */}
                                    <FilterSelect
                                        label="注目"
                                        value={data.is_featured}
                                        onChange={(value) =>
                                            setData("is_featured", value)
                                        }
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
                                            クリア
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* プロジェクトテーブル */}
                <ProjectsTable projects={projects} onDelete={handleDelete} />

                {/* ページネーション */}
                {projects.last_page > 0 && (
                    <Pagination paginationData={projects} />
                )}

                {/* データがない場合 */}
                {projects.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            🏢
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? "検索条件に一致するプロジェクトが見つかりませんでした。"
                                : activeTab === "only_trashed"
                                  ? "削除されたプロジェクトはありません。"
                                  : "まだプロジェクトが登録されていません。"}
                        </p>
                        {!filters.search && activeTab !== "only_trashed" && (
                            <CreateButton
                                href={route("admin.project.create")}
                                size="md"
                            >
                                最初のプロジェクトを作成
                            </CreateButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
