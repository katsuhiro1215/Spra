import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ResponseTemplateForm from "./_components/Form";

export default function Create() {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.responseTemplates.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.response.template.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.responseTemplates.breadcrumbs,
        PageConfig.responseTemplates.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.responseTemplates.pages.create.title}
                    description={
                        PageConfig.responseTemplates.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.responseTemplates.pages.create.title} />

            <FlashMessage />

            {/* フォーム */}
            <div className="max-w-7xl">
                <ResponseTemplateForm isEditing={false} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
