import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Service Components
import ServiceForm from "./_components/Form";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        service_category_id: "",
        description: "",
        details: "",
        icon: "",
        sort_order: 0,
        status: "active",
        is_featured: false,
    });

    const submit = () => {
        post(route("admin.service.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.services.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.service.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.services.breadcrumbs,
        PageConfig.services.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.services.pages.create.title}
                    description={PageConfig.services.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.services.pages.create.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <ServiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.index")}
                    categories={categories}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
