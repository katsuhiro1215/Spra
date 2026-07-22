import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { CreateButton } from "@/Components/Buttons";
import { DeleteAlert } from "@/Components/Alerts";
import SearchBar from "@/Components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PointCatalogItemsTable from "./_components/PointCatalogItemsTable";

export default function Index({ pointCatalogItems, filters = {}, stats = {} }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
    });

    const handleSearch = () => {
        get(route("admin.point-catalog-item.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (item) => setDeleteTarget(item);

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.point-catalog-item.destroy", deleteTarget.id),
                { onFinish: () => setDeleteTarget(null) },
            );
        }
    };

    const headerActions = [
        {
            label: "カタログ商品作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.point-catalog-item.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pointCatalogItems.title}
                    description={PageConfig.pointCatalogItems.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.pointCatalogItems.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pointCatalogItems.documentTitle} />

            <FlashMessage />

            <DeleteAlert
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

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
                            PageConfig.pointCatalogItems.ui.search.placeholder
                        }
                        disabled={processing}
                    />
                </div>

                <PointCatalogItemsTable
                    pointCatalogItems={pointCatalogItems}
                    onDelete={handleDelete}
                />

                {pointCatalogItems?.last_page > 1 && (
                    <Pagination paginationData={pointCatalogItems} />
                )}

                {pointCatalogItems?.data?.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            🎁
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {PageConfig.pointCatalogItems.ui.empty.noData}
                        </p>
                        <CreateButton
                            href={route("admin.point-catalog-item.create")}
                            size="md"
                        >
                            {PageConfig.pointCatalogItems.ui.empty.createFirst}
                        </CreateButton>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
