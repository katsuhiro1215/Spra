import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PointCatalogItemForm from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        points_cost: "",
        sort_order: 0,
        description: "",
        is_active: true,
    });

    const handleSubmit = () => {
        post(route("admin.point-catalog-item.store"));
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
        PageConfig.pointCatalogItems.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pointCatalogItems.pages.create.title}
                    description={
                        PageConfig.pointCatalogItems.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pointCatalogItems.pages.create.title} />

            <FlashMessage />

            <div className="max-w-4xl">
                <PointCatalogItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.point-catalog-item.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
