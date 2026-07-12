import React, { useState, useEffect } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import Pagination from "@/Components/Layout/Pagination";
// Icons
import {
    PlusIcon,
    FunnelIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
// MenuItem Components
import MenuItemsTable from "./_components/MenuItemsTable";

export default function Index({
    menu,
    menuItems,
    stats,
    allMenuItems,
    filters,
}) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        parent_id: filters.parent_id || "",
        is_active: filters.is_active || "",
        trashed: filters.trashed || "without",
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
        get(route("admin.website.menu.item.index", menu.id), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (menuItem) => {
        if (confirm(`メニューアイテム「${menuItem.label}」を削除しますか？`)) {
            router.delete(
                route("admin.website.menu.item.destroy", [
                    menu.id,
                    menuItem.id,
                ]),
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const headerActions = [
        {
            label: "メニュー一覧",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.menu.index"),
        },
        {
            label: showFilters ? "フィルターを閉じる" : "フィルター",
            icon: FunnelIcon,
            variant: "secondary",
            onClick: () => setShowFilters(!showFilters),
        },
        {
            label: "アイテム作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.website.menu.item.create", menu.id),
        },
    ];

    const ParentOptions = [
        { value: "", label: "すべてのアイテム" },
        { value: "null", label: "親アイテムのみ" },
        ...allMenuItems.map((item) => ({
            value: item.id,
            label: item.label,
        })),
    ];

    const StatusOptions = [
        { value: "", label: "すべて" },
        { value: "1", label: "有効" },
        { value: "0", label: "無効" },
    ];

    const TrashedOptions = [
        { value: "without", label: "削除済みを除く" },
        { value: "with", label: "削除済みを含む" },
        { value: "only", label: "削除済みのみ" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`${menu.name} - メニューアイテム管理`}
                    description="メニューのアイテムを管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title={`${menu.name} - メニューアイテム管理`} />
            <FlashMessage />

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全アイテム
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
                        placeholder="ラベル、URLで検索..."
                        processing={processing}
                    />

                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FilterSelect
                                label="親アイテム"
                                value={data.parent_id}
                                onChange={(value) => {
                                    setData("parent_id", value);
                                    setTimeout(() => handleFilter(), 0);
                                }}
                                options={ParentOptions}
                            />

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

                {/* メニューアイテム一覧 */}
                <MenuItemsTable
                    menu={menu}
                    menuItems={menuItems}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                <Pagination paginationData={menuItems} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
