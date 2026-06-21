import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Badge } from "@/Components/Badges";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Card } from "@/Components/Card";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { PageConfig } from "@/Constants/PageConfig";
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
        get(route("admin.project.category.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_active: "",
        });
        get(route("admin.project.category.index"), {
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
            router.delete(route("admin.project.category.destroy", category.id));
        }
    };

    // ========================================
    // Constants
    // ========================================
    const headerActions = [
        {
            label: PageConfig.projectCategories.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.project.category.create"),
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
                    title={PageConfig.projectCategories.title}
                    description={PageConfig.projectCategories.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.projectCategories.documentTitle} />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索とフィルター */}
                <Card>
                    <div className="p-6">
                        <div className="space-y-4">
                            <SearchBar
                                value={data.search}
                                onChange={(value) => setData("search", value)}
                                onSearch={handleSearch}
                                placeholder={
                                    PageConfig.projectCategories.ui.search
                                        .placeholder
                                }
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FilterSelect
                                    label={
                                        PageConfig.projectCategories.filters
                                            .status.label
                                    }
                                    value={data.is_active}
                                    onChange={(value) =>
                                        setData("is_active", value)
                                    }
                                    options={statusOptions}
                                    placeholder={
                                        PageConfig.projectCategories.filters
                                            .status.placeholder
                                    }
                                />

                                <div className="hidden md:block"></div>

                                <div className="flex items-end">
                                    <SecondaryButton
                                        onClick={handleClearFilters}
                                        disabled={!hasActiveFilters}
                                        size="md"
                                        className="w-full"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        {
                                            PageConfig.projectCategories.ui
                                                .filter.clear
                                        }
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

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
