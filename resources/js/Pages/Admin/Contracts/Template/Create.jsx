import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        template_type: "standard",
        terms_and_conditions: "",
        special_provisions: "",
        status: "active",
        sort_order: 0,
    });

    const submit = () => {
        post(route("admin.contract.template.store"));
    };

    const breadcrumbs = [
        ...PageConfig.contractTemplates.breadcrumbs,
        PageConfig.contractTemplates.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contractTemplates.pages.create.title}
                    description={
                        PageConfig.contractTemplates.pages.create.description
                    }
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contractTemplates.pages.create.title} />

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
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
