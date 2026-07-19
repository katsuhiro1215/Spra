import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import FaqCategoriesTable from "./_components/FaqCategoriesTable";

export default function Index({ categories, stats, filters }) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        is_active: filters.is_active || "",
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
        get(route("admin.website.faq.category.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (category) => {
        if (confirm(`カテゴリ「${category.name}」を削除しますか？`)) {
            router.delete(
                route("admin.website.faq.category.destroy", category.slug),
                {
                    preserveScroll: true,
                },
            );
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
            label: "カテゴリ作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.faq.category.create"),
        },
    ];

    const StatusOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "有効" },
        { value: "0", label: "無効" },
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
                    title="FAQカテゴリ管理"
                    description="よくある質問のカテゴリを管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="FAQカテゴリ管理" />
            <FlashMessage />

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全カテゴリ
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            有効
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
                            {stats.active}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            無効
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-orange-600 dark:text-orange-400">
                            {stats.inactive}
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
                        placeholder="カテゴリ名、スラッグ、説明で検索..."
                        processing={processing}
                    />

                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FilterSelect
                                label="ステータス"
                                value={data.is_active}
                                onChange={(value) => {
                                    setData("is_active", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={StatusOptions}
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

                {/* カテゴリ一覧 */}
                <FaqCategoriesTable
                    categories={categories}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                <Pagination paginationData={categories} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
