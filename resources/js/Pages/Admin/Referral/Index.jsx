import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, CreateButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ReferralsTable from "./_components/ReferralsTable";

export default function Index({
    referrals,
    filters = {},
    stats = {},
    statuses = {},
}) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
    });

    const handleSearch = () => {
        get(route("admin.referral.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (referral) => {
        const confirmed = confirm(
            `紹介コード「${referral.referral_code}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.referral.destroy", referral.id));
        }
    };

    const headerActions = [
        {
            label: "紹介を作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.referral.create"),
        },
    ];

    const statusOptions = [
        { value: "", label: "すべて" },
        ...Object.entries(statuses).map(([value, label]) => ({
            value,
            label,
        })),
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.referrals.title}
                    description={PageConfig.referrals.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.referrals.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.referrals.documentTitle} />

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
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.pending || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                未成約
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.contracted || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                成立済み
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.referrals.ui.search.placeholder
                            }
                            disabled={processing}
                        />
                    </div>
                    <div className="w-full lg:w-56">
                        <FilterSelect
                            label="ステータス"
                            value={data.status}
                            onChange={(value) => {
                                setData("status", value);
                                get(route("admin.referral.index"), {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                            options={statusOptions}
                        />
                    </div>
                </div>

                <ReferralsTable referrals={referrals} onDelete={handleDelete} />

                {referrals?.last_page > 1 && (
                    <Pagination paginationData={referrals} />
                )}

                {referrals?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            🤝
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {PageConfig.referrals.ui.empty.noData}
                        </p>
                        <CreateButton
                            href={route("admin.referral.create")}
                            size="md"
                        >
                            {PageConfig.referrals.ui.empty.createFirst}
                        </CreateButton>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
