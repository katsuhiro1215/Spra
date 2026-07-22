import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import MenusTable from "./_components/MenusTable";

export default function Index({ menus, stats, filters }) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        location: filters.location || "",
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
        get(route("admin.website.menu.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (menu) => {
        if (confirm(`メニュー「${menu.name}」を削除しますか？`)) {
            router.delete(route("admin.website.menu.destroy", menu.id), {
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
            label: "メニュー作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.menu.create"),
        },
    ];

    const LocationOptions = [
        { value: "", label: "すべての配置" },
        { value: "header", label: "ヘッダー" },
        { value: "footer", label: "フッター" },
        { value: "sidebar", label: "サイドバー" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="メニュー管理"
                    description="サイトのメニューを管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="メニュー管理" />
            <FlashMessage />

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全メニュー
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            ヘッダー
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">
                            {stats.header}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            フッター
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
                            {stats.footer}
                        </div>
                    </div>
                </div>

                {/* 検索とフィルター */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        placeholder="メニュー名、スラッグ、説明で検索..."
                        processing={processing}
                    />

                    {showFilters && (
                        <div className="mt-4">
                            <FilterSelect
                                label="配置場所"
                                value={data.location}
                                onChange={(value) => {
                                    setData("location", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={LocationOptions}
                            />
                        </div>
                    )}
                </div>

                {/* メニュー一覧 */}
                <MenusTable menus={menus} onDelete={handleDelete} />

                {/* ページネーション */}
                <Pagination paginationData={menus} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
