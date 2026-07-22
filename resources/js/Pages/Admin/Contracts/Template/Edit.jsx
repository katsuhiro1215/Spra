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
        template_type: template.template_type || "standard",
        terms_and_conditions: template.terms_and_conditions || "",
        special_provisions: template.special_provisions || "",
        status: template.status || "active",
        sort_order: template.sort_order || 0,
    });

    const submit = () => {
        put(route("admin.contract.template.update", template.id));
    };

    const headerActions = [
        {
            label: PageConfig.contractTemplates.actions.back,
            variant: "ghost",
            route: route("admin.contract.template.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contractTemplates.breadcrumbs,
        PageConfig.contractTemplates.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contractTemplates.pages.edit.title}
                    description={
                        PageConfig.contractTemplates.pages.edit.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contractTemplates.pages.edit.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <Form
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.contract.template.index")}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
