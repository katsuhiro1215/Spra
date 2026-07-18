import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import VoicesTable from "./_components/VoicesTable";

export default function Index({ voices, stats, services, filters }) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        service_id: filters.service_id || "",
        is_published: filters.is_published || "",
        is_featured: filters.is_featured || "",
        trashed: filters.trashed || "without_trashed",
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (data.search !== filters.search) {
                handleFilter();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [data.search]);

    const handleFilter = () => {
        get(route("admin.website.voice.index"), {
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
            label: showFilters ? "フィルターを閉じる" : "フィルター",
            icon: FunnelIcon,
            variant: "secondary",
            onClick: () => setShowFilters(!showFilters),
        },
        {
            label: "お客様の声を作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.voice.create"),
        },
    ];

    const ServiceOptions = [
        { value: "", label: "すべてのサービス" },
        ...services.map((service) => ({
            value: service.id,
            label: service.name,
        })),
    ];

    const StatusOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "公開中" },
        { value: "0", label: "非公開" },
    ];

    const FeaturedOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "注目表示のみ" },
    ];

    const TrashedOptions = [
        { value: "without_trashed", label: "削除済みを除く" },
        { value: "with_trashed", label: "削除済みを含む" },
        { value: "only_trashed", label: "削除済みのみ" },
    ];

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

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全件数
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            公開中
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
                            {stats.published}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            非公開
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-orange-600 dark:text-orange-400">
                            {stats.draft}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            削除済み
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-400 dark:text-slate-500">
                            {stats.trashed}
                        </div>
                    </div>
                </div>

                {/* 検索とフィルター */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        placeholder="表示名、会社名、本文で検索..."
                        processing={processing}
                    />

                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FilterSelect
                                label="対象サービス"
                                value={data.service_id}
                                onChange={(value) => {
                                    setData("service_id", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={ServiceOptions}
                            />

                            <FilterSelect
                                label="ステータス"
                                value={data.is_published}
                                onChange={(value) => {
                                    setData("is_published", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={StatusOptions}
                            />

                            <FilterSelect
                                label="注目表示"
                                value={data.is_featured}
                                onChange={(value) => {
                                    setData("is_featured", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={FeaturedOptions}
                            />

                            <FilterSelect
                                label="削除済み"
                                value={data.trashed}
                                onChange={(value) => {
                                    setData("trashed", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={TrashedOptions}
                            />
                        </div>
                    )}
                </div>

                {/* 一覧 */}
                <VoicesTable voices={voices} onDelete={handleDelete} />

                {/* ページネーション */}
                <Pagination paginationData={voices} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
