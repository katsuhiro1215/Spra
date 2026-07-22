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
    BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import CompaniesFilterBar from "./_components/CompaniesFilterBar";
import CompaniesTable from "./_components/CompaniesTable";
import CompaniesGrid from "./_components/CompaniesGrid";

const VIEW_MODE_STORAGE_KEY = "companies-view-mode";

export default function Index({ companies, filters = {}, stats = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState(
        () => localStorage.getItem(VIEW_MODE_STORAGE_KEY) || "table",
    );

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        company_type: filters.company_type || "",
        status: filters.status || "",
        industry: filters.industry || "",
    });

    // ========================================
    // Effects
    // ========================================
    // 表示モード（テーブル/グリッド）を記憶
    useEffect(() => {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    }, [viewMode]);

    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.company_type || data.status || data.industry) {
            setShowFilters(true);
        }
    }, [data.company_type, data.status, data.industry]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.company_type !== filters.company_type ||
                data.status !== filters.status ||
                data.industry !== filters.industry
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.company_type, data.status, data.industry]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.company.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            company_type: "",
            status: "",
            industry: "",
        });
        setShowFilters(false);
        get(route("admin.company.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (company) => {
        const confirmed = confirm(
            `${company.name} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.company.destroy", company.id));
        }
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.companies.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.company.create"),
        },
    ];

    const breadcrumbs = PageConfig.companies.breadcrumbs;

    // ========================================
    // Constants - Filters
    // ========================================
    const hasActiveFilters =
        data.search || data.company_type || data.status || data.industry;

    const activeFilterCount = [
        data.company_type,
        data.status,
        data.industry,
    ].filter(Boolean).length;

    // ========================================
    // Render
    // ========================================
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.companies.title}
                    description={PageConfig.companies.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.companies.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターツールバー */}
                <CompaniesFilterBar
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

                {companies.data.length > 0 ? (
                    <>
                        {/* 統計情報 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <div className="p-4 text-center">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats?.total ?? companies.total}
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
                                企業一覧 ({companies.total}件)
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
                            <CompaniesTable
                                companies={companies}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <CompaniesGrid
                                companies={companies}
                                onDelete={handleDelete}
                            />
                        )}

                        {/* ページネーション */}
                        <Pagination paginationData={companies} />
                    </>
                ) : (
                    /* データがない場合 */
                    <Card className="text-center py-12">
                        <BuildingOffice2Icon className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {filters.search
                                ? PageConfig.companies.ui.empty.noResults
                                : PageConfig.companies.ui.empty.noData}
                        </p>
                        {!filters.search && (
                            <CrudButton
                                action="create"
                                useTheme
                                href={route("admin.company.create")}
                                size="md"
                                icon={PlusIcon}
                            >
                                {PageConfig.companies.ui.empty.createFirst}
                            </CrudButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
