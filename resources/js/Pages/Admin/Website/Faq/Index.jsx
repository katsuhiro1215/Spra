import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import Pagination from "@/Components/Layout/Pagination";
// Icons
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
// Faq Components
import FaqsTable from "./_components/FaqsTable";

export default function Index({ faqs, stats, categories, filters }) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        faq_category_id: filters.faq_category_id || "",
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
        get(route("admin.website.faq.index"), {
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
            label: showFilters ? "フィルターを閉じる" : "フィルター",
            icon: FunnelIcon,
            variant: "secondary",
            onClick: () => setShowFilters(!showFilters),
        },
        {
            label: "FAQ作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.faq.create"),
        },
    ];

    const CategoryOptions = [
        { value: "", label: "すべてのカテゴリ" },
        ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
    ];

    const StatusOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "公開中" },
        { value: "0", label: "非公開" },
    ];

    const FeaturedOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "よくある質問のみ" },
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
                    title="FAQ管理"
                    description="よくある質問を管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="FAQ管理" />
            <FlashMessage />

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全FAQ
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
                        placeholder="質問、回答で検索..."
                        processing={processing}
                    />

                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FilterSelect
                                label="カテゴリ"
                                value={data.faq_category_id}
                                onChange={(value) => {
                                    setData("faq_category_id", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={CategoryOptions}
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
                                label="よくある質問"
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

                {/* FAQ一覧 */}
                <FaqsTable faqs={faqs} onDelete={handleDelete} />

                {/* ページネーション */}
                <Pagination paginationData={faqs} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
