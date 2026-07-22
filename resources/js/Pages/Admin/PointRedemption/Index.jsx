import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import FilterSelect from "@/Components/FilterSelect";
import { PageConfig } from "@/Constants/PageConfig";
import PointRedemptionsTable from "./_components/PointRedemptionsTable";

export default function Index({
    redemptions,
    filters = {},
    stats = {},
    statuses = {},
}) {
    const { data, setData, get } = useForm({
        status: filters?.status || "",
    });

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
                    title={PageConfig.pointRedemptions.title}
                    description={PageConfig.pointRedemptions.description}
                    breadcrumbs={PageConfig.pointRedemptions.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pointRedemptions.documentTitle} />

            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-4">
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
                                申請中
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.approved || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                承認済み
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {stats.rejected || 0}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                却下
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="w-full lg:w-56">
                    <FilterSelect
                        label="ステータス"
                        value={data.status}
                        onChange={(value) => {
                            setData("status", value);
                            get(route("admin.point-redemption.index"), {
                                data: { status: value },
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        options={statusOptions}
                    />
                </div>

                <PointRedemptionsTable redemptions={redemptions} />

                {redemptions?.last_page > 1 && (
                    <Pagination paginationData={redemptions} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
