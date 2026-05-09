import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import { Badge } from "@/Components/Badge";
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
}) {
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
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.projects.index"), {
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
        get(route("admin.projects.index"), {
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
            router.delete(route("admin.projects.destroy", project.id));
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
            route: route("admin.projects.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "プロジェクト", href: null },
    ];

    const hasActiveFilters =
        data.search ||
        data.status ||
        data.priority ||
        data.category_id ||
        data.admin_id;

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
                            placeholder="プロジェクト名、説明、コードで検索..."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={statusOptions}
                            />

                            <FilterSelect
                                label="優先度"
                                value={data.priority}
                                onChange={(value) => setData("priority", value)}
                                options={priorityOptions}
                            />

                            <FilterSelect
                                label="カテゴリ"
                                value={data.category_id}
                                onChange={(value) =>
                                    setData("category_id", value)
                                }
                                options={categoryOptions}
                            />

                            <FilterSelect
                                label="担当者"
                                value={data.admin_id}
                                onChange={(value) => setData("admin_id", value)}
                                options={adminOptions}
                            />
                        </div>

                        {hasActiveFilters && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                >
                                    フィルターをクリア
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* プロジェクトテーブル */}
                <ProjectsTable projects={projects} onDelete={handleDelete} />

                {/* ページネーション */}
                <Pagination links={projects.links} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
