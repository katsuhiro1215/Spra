import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, CreateButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PointRewardsTable from "./_components/PointRewardsTable";

export default function Index({ pointRewards, filters = {}, stats = {} }) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
    });

    const handleSearch = () => {
        get(route("admin.point-reward.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (pointReward) => {
        const confirmed = confirm(
            `「${pointReward.name}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(
                route("admin.point-reward.destroy", pointReward.id),
            );
        }
    };

    const headerActions = [
        {
            label: "ポイント特典作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.point-reward.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pointRewards.title}
                    description={PageConfig.pointRewards.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.pointRewards.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pointRewards.documentTitle} />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="flex-1 max-w-md">
                    <SearchBar
                        value={data.search}
                        onChange={(value) => setData("search", value)}
                        onSearch={handleSearch}
                        placeholder={PageConfig.pointRewards.ui.search.placeholder}
                        disabled={processing}
                    />
                </div>

                <PointRewardsTable
                    pointRewards={pointRewards}
                    onDelete={handleDelete}
                />

                {pointRewards?.last_page > 1 && (
                    <Pagination paginationData={pointRewards} />
                )}

                {pointRewards?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            🏅
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {PageConfig.pointRewards.ui.empty.noData}
                        </p>
                        <CreateButton
                            href={route("admin.point-reward.create")}
                            size="md"
                        >
                            {PageConfig.pointRewards.ui.empty.createFirst}
                        </CreateButton>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
