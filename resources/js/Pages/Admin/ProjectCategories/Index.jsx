import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import { Badge } from "@/Components/Badges";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
// Table Component
import ProjectCategoriesTable from "./_components/ProjectCategoriesTable";

export default function Index({ categories, filters = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        is_active: filters.is_active ?? "",
    });

    // ========================================
    // Effects
    // ========================================
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.is_active !== (filters.is_active ?? "")) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.is_active]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.project-categories.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_active: "",
        });
        get(route("admin.project-categories.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (category) => {
        const confirmed = confirm(
            `${category.name} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(
                route("admin.project-categories.destroy", category.id),
            );
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
            route: route("admin.project-categories.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "プロジェクトカテゴリ", href: null },
    ];

    const hasActiveFilters = data.search || data.is_active !== "";

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
                    title="プロジェクトカテゴリ"
                    description="プロジェクトの分類を管理"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクトカテゴリ一覧" />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索とフィルター */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                検索・フィルター
                            </h3>
                        </div>
                        {hasActiveFilters && (
                            <Badge
                                variant="info"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                フィルター中
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="カテゴリ名、スラッグ、説明で検索..."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FilterSelect
                                label="ステータス"
                                value={data.is_active}
                                onChange={(value) =>
                                    setData("is_active", value)
                                }
                                options={statusOptions}
                            />

                            {hasActiveFilters && (
                                <div className="flex items-end">
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                    >
                                        フィルターをクリア
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* テーブル */}
                <ProjectCategoriesTable
                    categories={categories}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                {categories.data && categories.data.length > 0 && (
                    <Pagination
                        links={categories.links}
                        currentPage={categories.current_page}
                        lastPage={categories.last_page}
                        total={categories.total}
                    />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
