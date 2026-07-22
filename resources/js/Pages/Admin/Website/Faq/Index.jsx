import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import FaqsFilterBar from "./_components/FaqsFilterBar";
import FaqsTable from "./_components/FaqsTable";

const DEFAULT_TRASHED = "without_trashed";

const buildFilterState = (filters) => ({
    search: filters.search || "",
    faq_category_id: filters.faq_category_id || "",
    is_published: filters.is_published || "",
    is_featured: filters.is_featured || "",
    trashed: filters.trashed || DEFAULT_TRASHED,
});

export default function Index({ faqs, stats, categories, filters }) {
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
        if (data.faq_category_id || data.is_published || data.is_featured) {
            setShowFilters(true);
        }
    }, [data.faq_category_id, data.is_published, data.is_featured]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.faq_category_id !== filters.faq_category_id ||
                data.is_published !== filters.is_published ||
                data.is_featured !== filters.is_featured
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.faq_category_id, data.is_published, data.is_featured]);

    const handleTabChange = (tab) => {
        router.get(
            route("admin.website.faq.index"),
            {
                search: data.search,
                faq_category_id: data.faq_category_id,
                is_published: data.is_published,
                is_featured: data.is_featured,
                trashed: tab,
            },
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = () => {
        get(route("admin.website.faq.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            faq_category_id: "",
            is_published: "",
            is_featured: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.website.faq.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (faq) => {
        if (confirm(`FAQ「${faq.question}」を削除しますか？`)) {
            router.delete(route("admin.website.faq.destroy", faq.id), {
                preserveScroll: true,
            });
        }
    };

    const headerActions = [
        {
            label: "FAQ作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.faq.create"),
        },
    ];

    const tabs = [
        { key: "with_trashed", label: "すべて", count: stats?.total ?? faqs.total },
        {
            key: "without_trashed",
            label: "有効一覧",
            count: (stats?.published ?? 0) + (stats?.draft ?? 0),
        },
        { key: "only_trashed", label: "削除済み", count: stats?.trashed ?? 0 },
    ];

    const hasActiveFilters =
        data.search || data.faq_category_id || data.is_published || data.is_featured;

    const activeFilterCount = [
        data.faq_category_id,
        data.is_published,
        data.is_featured,
    ].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="FAQ管理"
                    description="よくある質問を管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="FAQ管理" />
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
                                全FAQ
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.published}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                公開中
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {stats.draft}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                非公開
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
                <FaqsFilterBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    data={data}
                    setData={setData}
                    onSearch={handleSearch}
                    searchDisabled={processing}
                    categories={categories}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    activeFilterCount={activeFilterCount}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                {/* FAQ一覧 */}
                <FaqsTable faqs={faqs} onDelete={handleDelete} />

                {/* ページネーション */}
                {faqs?.last_page > 1 && <Pagination paginationData={faqs} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
