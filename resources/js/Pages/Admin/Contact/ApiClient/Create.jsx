import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Create() {
    const breadcrumbs = [
        ...PageConfig.contactApiClients.breadcrumbs,
        {
            label: "新規作成",
            route: route("admin.contact.api-client.create"),
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
                    title="新しいAPIクライアントを作成"
                    description={PageConfig.contactApiClients.description}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title="APIクライアントを作成 - API連携設定" />

            <div className="max-w-2xl">
                <Form />
            </div>
        </AdminAuthenticatedLayout>
    );
}
