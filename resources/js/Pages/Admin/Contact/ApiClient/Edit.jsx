import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Edit({ client }) {
    const breadcrumbs = [
        ...PageConfig.contactApiClients.breadcrumbs,
        {
            label: client.name,
            route: route("admin.contact.api-client.edit", client.id),
        },
    ];

    const headerActions = [
        {
            label: PageConfig.contactApiClients.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contact.api-client.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`APIクライアントを編集: ${client.name}`}
                    description={PageConfig.contactApiClients.description}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title={`APIクライアントを編集 - ${client.name}`} />

            <div className="max-w-2xl">
                <Form client={client} isEditing={true} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
