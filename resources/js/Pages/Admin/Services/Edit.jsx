import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";
import ServiceForm from "./_components/Form";

export default function Edit({ service, categories, technologies, mediaList }) {
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || "",
        slug: service.slug || "",
        service_category_id: service.service_category_id || "",
        description: service.description || "",
        details: service.details || "",
        icon: service.icon || "",
        sort_order: service.sort_order || 0,
        status: service.status || "active",
        is_displayed: service.is_displayed ?? true,
        is_featured: service.is_featured || false,
        media_ids: (service.media || [])
            .slice()
            .sort((a, b) => (a.pivot?.sort_order ?? 0) - (b.pivot?.sort_order ?? 0))
            .map((media) => media.id),
        technology_ids: (service.technologies || []).map(
            (technology) => technology.id,
        ),
    });

    const submit = () => {
        put(route("admin.service.update", service.id));
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

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`${PageConfig.services.pages.edit.title}: ${service.name}`}
                    description={PageConfig.services.pages.edit.description}
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.services.breadcrumbs,
                        PageConfig.services.pages.edit.breadcrumb,
                    ]}
                />
            }
        >
            <Head
                title={`${PageConfig.services.pages.edit.title} - ${service.name}`}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <ServiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.show", service.id)}
                    categories={categories}
                    technologies={technologies}
                    mediaList={[
                        ...(service.media || []),
                        ...mediaList.filter(
                            (media) =>
                                !(service.media || []).some(
                                    (attached) => attached.id === media.id,
                                ),
                        ),
                    ]}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
