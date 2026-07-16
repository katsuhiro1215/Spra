import React, { useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import Pagination from "@/Components/Layout/Pagination";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// History Components
import HistoryTable from "./_components/HistoryTable";

export default function Index({ histories, stats, filters }) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (data.search !== filters.search) {
                get(route("admin.organization.history.index"), {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [data.search]);

    const handleDelete = (history) => {
        if (confirm(`沿革「${history.title}」を削除しますか？`)) {
            router.delete(
                route("admin.organization.history.destroy", history.id),
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const headerActions = [
        {
            label: "沿革を追加",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.organization.history.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="組織沿革管理"
                    description="Webサイトに表示する沿革を管理します"
                    actions={headerActions}
                />
            }
        >
            <Head title="組織沿革管理" />
            <FlashMessage />

            <div className="space-y-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            全件
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            公開
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
                            {stats.unpublished}
                        </div>
                    </div>
                </div>

                {/* 検索 */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        placeholder="タイトル、説明で検索..."
                        processing={processing}
                    />
                </div>

                {/* 沿革一覧 */}
                <HistoryTable histories={histories} onDelete={handleDelete} />

                {/* ページネーション */}
                <Pagination paginationData={histories} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
