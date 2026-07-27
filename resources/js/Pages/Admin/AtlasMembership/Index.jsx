import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import AtlasMembershipsTable from "./_components/AtlasMembershipsTable";

export default function Index({ memberships, filters = {}, stats = {} }) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
    });

    const handleSearch = () => {
        get(route("admin.atlas-membership.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (status) => {
        setData("status", status);
        get(route("admin.atlas-membership.index"), {
            data: { ...data, status },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const headerActions = [
        {
            label: "Atlas会員を追加",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.atlas-membership.create"),
        },
    ];

    const statusOptions = [
        { value: "", label: "すべてのステータス" },
        { value: "pending", label: "審査中" },
        { value: "active", label: "有効" },
        { value: "paused", label: "一時停止" },
        { value: "revoked", label: "失効" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="Atlas会員管理"
                    description="富裕層向けサービス「Atlas」の会員（Concierge / Life / Japan）を管理します"
                    actions={headerActions}
                    breadcrumbs={[{ label: "Atlas" }, { label: "会員管理" }]}
                />
            }
        >
            <Head title="Atlas会員管理" />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.total || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                総件数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.active || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                有効
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {stats.pending || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                審査中
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="メールアドレスで検索"
                            disabled={processing}
                        />
                    </div>
                    <select
                        value={data.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        disabled={processing}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <AtlasMembershipsTable memberships={memberships} />

                {memberships?.last_page > 1 && (
                    <Pagination paginationData={memberships} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
