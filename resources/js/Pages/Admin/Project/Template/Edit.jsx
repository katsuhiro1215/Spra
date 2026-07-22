import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Edit({ template }) {
    const { data, setData, put, processing, errors } = useForm({
        name: template.name || "",
        description: template.description || "",
        icon: template.icon || "",
        is_active: template.is_active ?? true,
        sort_order: template.sort_order || 0,
        milestones: template.milestones || [],
    });

    const submit = () => {
        put(route("admin.project.template.update", template.id));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.projectTemplates.actions.back,
            variant: "ghost",
            route: route("admin.project.template.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.projectTemplates.breadcrumbs,
        PageConfig.projectTemplates.pages.edit.breadcrumb
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.projectTemplates.pages.edit.title}
                    description={PageConfig.projectTemplates.pages.edit.description.replace("{name}", template.name)}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.projectTemplates.pages.edit.title.replace("{name}", template.name)} />
            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <Form
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.project.template.index")}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
