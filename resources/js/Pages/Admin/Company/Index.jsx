import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import {
    COMPANY_TYPE_OPTIONS,
    ADMIN_STATUS_OPTIONS,
    INDUSTRY_OPTIONS,
} from "@/Constants/SelectOptions";
import CompaniesTable from "./_components/CompaniesTable";

export default function Index({ companies, filters = {}, stats = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        company_type: filters.company_type || "",
        status: filters.status || "",
        industry: filters.industry || "",
    });

    // ========================================
    // Effects
    // ========================================
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
                {/* 検索 + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* 検索バー */}
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.companies.ui.search.placeholder
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
                            aria-expanded={showFilters}
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            {PageConfig.companies.ui.filter.button}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label={
                                    PageConfig.companies.filters.companyType
                                        .label
                                }
                                value={data.company_type}
                                onChange={(value) =>
                                    setData("company_type", value)
                                }
                                options={COMPANY_TYPE_OPTIONS}
                                placeholder={
                                    PageConfig.companies.filters.companyType
                                        .placeholder
                                }
                            />

                            <FilterSelect
                                label={
                                    PageConfig.companies.filters.status.label
                                }
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={ADMIN_STATUS_OPTIONS}
                                placeholder={
                                    PageConfig.companies.filters.status
                                        .placeholder
                                }
                            />

                            <FilterSelect
                                label={
                                    PageConfig.companies.filters.industry
                                        .label
                                }
                                value={data.industry}
                                onChange={(value) =>
                                    setData("industry", value)
                                }
                                options={INDUSTRY_OPTIONS}
                                placeholder={
                                    PageConfig.companies.filters.industry
                                        .placeholder
                                }
                            />

                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    className="w-full"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    {PageConfig.companies.ui.filter.clear}
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

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

                        {/* 企業一覧テーブル */}
                        <CompaniesTable
                            companies={companies}
                            onDelete={handleDelete}
                        />

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
                            <PrimaryButton
                                href={route("admin.company.create")}
                                size="md"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                {PageConfig.companies.ui.empty.createFirst}
                            </PrimaryButton>
                        )}
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
