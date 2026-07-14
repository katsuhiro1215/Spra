import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
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
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.companies.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.company.create"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.companies.breadcrumbs,
        PageConfig.companies.pages.create.breadcrumb,
    ];

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

    const companyTypeOptions = [
        { value: "", label: "すべて" },
        { value: "individual", label: "個人" },
        { value: "corporate", label: "法人" },
    ];

    const statusOptions = [
        { value: "", label: "すべて" },
        { value: "active", label: "アクティブ" },
        { value: "inactive", label: "非アクティブ" },
        { value: "suspended", label: "停止中" },
    ];

    const industryOptions = [
        { value: "", label: "すべて" },
        { value: "製造業", label: "製造業" },
        { value: "IT・ソフトウェア", label: "IT・ソフトウェア" },
        { value: "建設・不動産", label: "建設・不動産" },
        { value: "小売・卸売", label: "小売・卸売" },
        { value: "金融・保険", label: "金融・保険" },
        { value: "運輸・物流", label: "運輸・物流" },
        { value: "医療・介護", label: "医療・介護" },
        { value: "教育", label: "教育" },
        { value: "飲食・宿泊", label: "飲食・宿泊" },
        { value: "コンサルティング", label: "コンサルティング" },
        { value: "マーケティング・広告", label: "マーケティング・広告" },
        { value: "エネルギー", label: "エネルギー" },
        { value: "農業・林業・漁業", label: "農業・林業・漁業" },
        { value: "公務", label: "公務" },
        { value: "その他", label: "その他" },
    ];

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
                {/* 検索・フィルターカード */}
                {/* 検索 + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* 検索バー */}
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) =>
                                setData("search", value)
                            }
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.companies.ui.search
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
                                    PageConfig.companies.filters
                                        .companyType.label
                                }
                                value={data.company_type}
                                onChange={(value) =>
                                    setData("company_type", value)
                                }
                                options={companyTypeOptions}
                            />

                            <FilterSelect
                                label={
                                    PageConfig.companies.filters.status
                                        .label
                                }
                                value={data.status}
                                onChange={(value) =>
                                    setData("status", value)
                                }
                                options={statusOptions}
                            />

                            <FilterSelect
                                label={
                                    PageConfig.companies.filters
                                        .industry.label
                                }
                                value={data.industry}
                                onChange={(value) =>
                                    setData("industry", value)
                                }
                                options={industryOptions}
                            />

                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    className="w-full"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    {
                                        PageConfig.companies.ui.filter
                                            .clear
                                    }
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* 企業一覧テーブル */}
                <CompaniesTable companies={companies} onDelete={handleDelete} />

                {/* ページネーション */}
                {companies.last_page > 0 && (
                    <Pagination paginationData={companies} />
                )}

                {/* データがない場合 */}
                {companies.data.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            🏢
                        </div>
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
