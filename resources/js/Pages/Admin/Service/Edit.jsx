import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// Service Components
import ServiceForm from "./_components/Form";

export default function Edit({ service, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || "",
        slug: service.slug || "",
        service_category_id: service.service_category_id || "",
        description: service.description || "",
        details: service.details || "",
        icon: service.icon || "",
        sort_order: service.sort_order || 0,
        status: service.status || "active",
        is_featured: service.is_featured || false,
    });

    const submit = () => {
        put(route("admin.service.services.update", service.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "サービスを追加",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.services.create"),
        },
    ];

    const breadcrumbs = [
        { label: "サービス管理", href: null },
        {
            label: "サービス一覧",
            href: route("admin.service.services.index"),
        },
        { label: "サービス編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`サービス編集: ${service.name}`}
                    description="サービス情報を編集します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`サービス編集 - ${service.name}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ServiceForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={submit}
                        cancelRoute={route("admin.service.services.index")}
                        categories={categories}
                        isEdit={true}
                    />
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
