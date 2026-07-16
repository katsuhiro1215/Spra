import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Edit({ service }) {
    const breadcrumbs = [
        ...PageConfig.externalServices.breadcrumbs,
        {
            label: service.name,
            route: route("admin.external-service.edit", service.id),
        },
    ];

    const headerActions = [
        {
            label: PageConfig.externalServices.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.external-service.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`外部サービスを編集: ${service.name}`}
                    description={PageConfig.externalServices.description}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title={`外部サービスを編集 - ${service.name}`} />

            <div className="max-w-3xl">
                <Form service={service} isEditing={true} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
