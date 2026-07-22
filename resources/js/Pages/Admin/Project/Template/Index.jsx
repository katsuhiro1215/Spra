import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, CreateButton } from "@/Components/Buttons";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ProjectTemplateTable from "./_components/ProjectTemplateTable";

export default function Index({ templates, filters = {}, stats }) {
    // ========================================
    // State & Form
    // ========================================
    const [activeTab, setActiveTab] = useState(
        filters.trashed || "without_trashed",
    );
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        is_active: filters.is_active ?? "",
    });

    // ========================================
    // Effects
    // ========================================
    // propsが更新されたらstateも更新
    useEffect(() => {
        setActiveTab(filters.trashed || "without_trashed");
        setData({
            search: filters.search || "",
            is_active: filters.is_active ?? "",
            trashed: filters.trashed || "",
        });
    }, [filters.trashed]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.is_active !== "") {
            setShowFilters(true);
        }
    }, [data.is_active]);

    // フィルター変更時に検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.is_active !== (filters.is_active ?? "")) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.is_active]);

    // ========================================
    // Handlers - Tab
    // ========================================
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(
            route("admin.project.template.index"),
            {
                search: data.search,
                is_active: data.is_active,
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
        get(route("admin.project.template.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_active: "",
        });
        get(route("admin.project.template.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (template) => {
        const confirmed = confirm(
            `${template.name} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.project.template.destroy", template.id));
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.projectTemplates.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.project.template.create"),
        },
    ];

    // ========================================
    // Constants - Tabs & Filters
    // ========================================
    const tabs = [
        {
            key: "with_trashed",
            label: PageConfig.projectTemplates.ui.tabs.all,
            count: stats?.all || templates.total,
        },
        {
            key: "without_trashed",
            label: PageConfig.projectTemplates.ui.tabs.list,
            count: stats?.active || templates.total,
        },
        {
            key: "only_trashed",
            label: PageConfig.projectTemplates.ui.tabs.trashed,
            count: stats?.trashed || 0,
        },
    ];

    const hasActiveFilters = data.search || data.is_active !== "";

    const activeFilterCount = [data.is_active].filter(Boolean).length;

    const statusOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "アクティブ" },
        { value: "0", label: "非アクティブ" },
    ];

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.projectTemplates.title}
                    description={PageConfig.projectTemplates.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.projectTemplates.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.projectTemplates.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
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
                            placeholder={
                                PageConfig.projectTemplates.ui.search
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
                            {
                                PageConfig.projectTemplates.ui.filter
                                    .button
                            }
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
                                    PageConfig.projectTemplates.filters
                                        .status.label
                                }
                                value={data.is_active}
                                onChange={(value) =>
                                    setData("is_active", value)
                                }
                                options={statusOptions}
                                placeholder={
                                    PageConfig.projectTemplates.filters
                                        .status.placeholder
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
                                        PageConfig.projectTemplates.ui
                                            .filter.clear
                                    }
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* テーブル */}
                <ProjectTemplateTable
                    templates={templates.data}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                {templates.data.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                        <Pagination paginationData={templates} />
                    </div>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
