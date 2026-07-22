import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import VoicesFilterBar from "./_components/VoicesFilterBar";
import VoicesTable from "./_components/VoicesTable";

const DEFAULT_TRASHED = "without_trashed";

const buildFilterState = (filters) => ({
    search: filters.search || "",
    service_id: filters.service_id || "",
    is_published: filters.is_published || "",
    is_featured: filters.is_featured || "",
    trashed: filters.trashed || DEFAULT_TRASHED,
});

export default function Index({ voices, stats, services, filters }) {
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
        if (data.service_id || data.is_published || data.is_featured) {
            setShowFilters(true);
        }
    }, [data.service_id, data.is_published, data.is_featured]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.service_id !== filters.service_id ||
                data.is_published !== filters.is_published ||
                data.is_featured !== filters.is_featured
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.service_id, data.is_published, data.is_featured]);

    const handleTabChange = (tab) => {
        router.get(
            route("admin.website.voice.index"),
            {
                search: data.search,
                service_id: data.service_id,
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
        get(route("admin.website.voice.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            service_id: "",
            is_published: "",
            is_featured: "",
            trashed: activeTab,
        });
        setShowFilters(false);
        get(route("admin.website.voice.index", { trashed: activeTab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (voice) => {
        if (confirm(`お客様の声「${voice.author_name}」を削除しますか？`)) {
            router.delete(route("admin.website.voice.destroy", voice.id), {
                preserveScroll: true,
            });
        }
    };

    const headerActions = [
        {
            label: "お客様の声を作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.voice.create"),
        },
    ];

    const tabs = [
        {
            key: "with_trashed",
            label: "すべて",
            count: stats?.total ?? voices.total,
        },
        {
            key: "without_trashed",
            label: "有効一覧",
            count: (stats?.published ?? 0) + (stats?.draft ?? 0),
        },
        { key: "only_trashed", label: "削除済み", count: stats?.trashed ?? 0 },
    ];

    const hasActiveFilters =
        data.search || data.service_id || data.is_published || data.is_featured;

    const activeFilterCount = [
        data.service_id,
        data.is_published,
        data.is_featured,
    ].filter(Boolean).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お客様の声管理"
                    description="Webサイトに掲載するお客様の声を管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="お客様の声管理" />
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
                                全件数
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
                <VoicesFilterBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    data={data}
                    setData={setData}
                    onSearch={handleSearch}
                    searchDisabled={processing}
                    services={services}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    activeFilterCount={activeFilterCount}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                {/* 一覧 */}
                <VoicesTable voices={voices} onDelete={handleDelete} />

                {/* ページネーション */}
                {voices?.last_page > 1 && (
                    <Pagination paginationData={voices} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
