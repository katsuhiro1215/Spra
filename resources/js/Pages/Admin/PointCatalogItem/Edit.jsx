import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PointCatalogItemForm from "./_components/Form";

export default function Edit({ pointCatalogItem }) {
    const { data, setData, put, processing, errors } = useForm({
        name: pointCatalogItem.name || "",
        points_cost: pointCatalogItem.points_cost ?? "",
        sort_order: pointCatalogItem.sort_order ?? 0,
        description: pointCatalogItem.description || "",
        is_active: pointCatalogItem.is_active ?? true,
    });

    const handleSubmit = () => {
        put(route("admin.point-catalog-item.update", pointCatalogItem.id));
    };

    const headerActions = [
        {
            label: PageConfig.pointCatalogItems.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.point-catalog-item.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.pointCatalogItems.breadcrumbs,
        PageConfig.pointCatalogItems.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pointCatalogItems.pages.edit.title}
                    description={`「${pointCatalogItem.name}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.pointCatalogItems.pages.edit.title} - ${pointCatalogItem.name}`}
            />

            <FlashMessage />

            <div className="max-w-4xl">
                <PointCatalogItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.point-catalog-item.index")}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
