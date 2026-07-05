import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// ProjectTemplate Components
import Form from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        icon: "",
        is_active: true,
        sort_order: 0,
        milestones: [],
    });

    const submit = () => {
        post(route("admin.project.template.store"));
    };

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.projectTemplates.breadcrumbs,
        PageConfig.projectTemplates.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.projectTemplates.pages.create.title}
                    description={
                        PageConfig.projectTemplates.pages.create.description
                    }
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.projectTemplates.pages.create.title} />

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
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
