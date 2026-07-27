import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import SearchBar from "@/Components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import AtlasInviteCodesTable from "./_components/AtlasInviteCodesTable";

export default function Index({ inviteCodes, filters = {}, stats = {} }) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
    });

    const handleSearch = () => {
        get(route("admin.atlas-invite-code.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (status) => {
        setData("status", status);
        get(route("admin.atlas-invite-code.index"), {
            data: { ...data, status },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const headerActions = [
        {
            label: "招待コードを発行",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.atlas-invite-code.create"),
        },
    ];

    const statusOptions = [
        { value: "", label: "すべてのステータス" },
        { value: "unused", label: "未使用" },
        { value: "used", label: "使用済み" },
        { value: "revoked", label: "失効" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="Atlas招待コード管理"
                    description="Private Room登録に必要な招待コードを発行・管理します"
                    actions={headerActions}
                    breadcrumbs={[{ label: "Atlas" }, { label: "招待コード管理" }]}
                />
            }
        >
            <Head title="Atlas招待コード管理" />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.total || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                総発行数
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.unused || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                未使用
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                                {stats.used || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                使用済み
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
                            placeholder="コードで検索"
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

                <AtlasInviteCodesTable inviteCodes={inviteCodes} />

                {inviteCodes?.last_page > 1 && (
                    <Pagination paginationData={inviteCodes} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
