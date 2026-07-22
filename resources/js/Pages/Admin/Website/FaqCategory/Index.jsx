import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import FaqCategoriesFilterBar from "./_components/FaqCategoriesFilterBar";
import FaqCategoriesTable from "./_components/FaqCategoriesTable";

const DEFAULT_TRASHED = "without_trashed";

const buildFilterState = (filters) => ({
    search: filters.search || "",
    is_active: filters.is_active || "",
    trashed: filters.trashed || DEFAULT_TRASHED,
});

export default function Index({ categories, stats, filters }) {
    const [activeTab, setActiveTab] = useState(
        filters.trashed || DEFAULT_TRASHED,
    );
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm(
        buildFilterState(filters),
    );

    useEffect(() => {
        setActiveTab(filters.trashed || DEFAULT_TRASHED);
        setData(buildFilterState(filters));
    }, [filters.trashed]);

    useEffect(() => {
        if (data.is_active) {
            setShowFilters(true);
        }
    }, [data.is_active]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.is_active !== filters.is_active) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.is_active]);

    const handleTabChange = (tab) => {
        router.get(
            route("admin.website.faq.category.index"),
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

    const handleSearch = () => {
        get(route("admin.website.faq.category.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            is_active: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.website.faq.category.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (category) => {
        if (confirm(`カテゴリ「${category.name}」を削除しますか？`)) {
            router.delete(
                route("admin.website.faq.category.destroy", category.slug),
                { preserveScroll: true },
            );
        }
    };

    const headerActions = [
        {
            label: "カテゴリ作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.faq.category.create"),
        },
    ];

    const tabs = [
        {
            key: "with_trashed",
            label: "すべて",
            count: stats?.total ?? categories.total,
        },
        {
            key: "without_trashed",
            label: "有効一覧",
            count: stats?.active ?? categories.total,
        },
        { key: "only_trashed", label: "削除済み", count: stats?.trashed ?? 0 },
    ];

    const hasActiveFilters = data.search || data.is_active;
    const activeFilterCount = [data.is_active].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="FAQカテゴリ管理"
                    description="よくある質問のカテゴリを管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="FAQカテゴリ管理" />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.total}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                全カテゴリ
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.active}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                有効
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {stats.inactive}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                無効
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-400 dark:text-slate-500">
                                {stats.trashed}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                削除済み
                            </div>
                        </div>
                    </Card>
                </div>

                {/* タブ + 検索 + フィルター（テーブルの上に集約） */}
                <FaqCategoriesFilterBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
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

                {/* カテゴリ一覧 */}
                <FaqCategoriesTable
                    categories={categories}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                {categories?.last_page > 1 && (
                    <Pagination paginationData={categories} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
