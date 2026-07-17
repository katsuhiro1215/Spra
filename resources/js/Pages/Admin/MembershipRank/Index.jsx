import React from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { CreateButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import MembershipRanksTable from "./_components/MembershipRanksTable";

export default function Index({ membershipRanks, filters = {}, stats = {} }) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
    });

    const handleSearch = () => {
        get(route("admin.membership-rank.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (rank) => {
        const confirmed = confirm(
            `「${rank.name}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.membership-rank.destroy", rank.id));
        }
    };

    const headerActions = [
        {
            label: "会員ランク作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.membership-rank.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.membershipRanks.title}
                    description={PageConfig.membershipRanks.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.membershipRanks.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.membershipRanks.documentTitle} />

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
                        placeholder={
                            PageConfig.membershipRanks.ui.search.placeholder
                        }
                        disabled={processing}
                    />
                </div>

                <MembershipRanksTable
                    membershipRanks={membershipRanks}
                    onDelete={handleDelete}
                />

                {membershipRanks?.last_page > 1 && (
                    <Pagination paginationData={membershipRanks} />
                )}

                {membershipRanks?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            🏆
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {PageConfig.membershipRanks.ui.empty.noData}
                        </p>
                        <CreateButton
                            href={route("admin.membership-rank.create")}
                            size="md"
                        >
                            {PageConfig.membershipRanks.ui.empty.createFirst}
                        </CreateButton>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
