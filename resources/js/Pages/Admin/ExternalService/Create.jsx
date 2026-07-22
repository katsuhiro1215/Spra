import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Create() {
    const breadcrumbs = [
        ...PageConfig.externalServices.breadcrumbs,
        {
            label: "新規登録",
            route: route("admin.external-service.create"),
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
                    title="外部サービスを登録"
                    description={PageConfig.externalServices.description}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title="外部サービスを登録 - 外部サービス連携" />

            <div className="max-w-3xl">
                <Form />
            </div>
        </AdminAuthenticatedLayout>
    );
}
