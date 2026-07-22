import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PageForm from "./_components/PageForm";
import PageSectionsManager from "./_components/PageSectionsManager";

export default function Edit({ page, pageTypes, mediaList }) {
    const { data, setData, put, processing, errors } = useForm({
        page_type_id: page.page_type_id || "",
        title: page.title || "",
        slug: page.slug || "",
        meta_title: page.meta_title || "",
        meta_description: page.meta_description || "",
        is_published: page.is_published || false,
        sort_order: page.sort_order || 0,
    });

    const handleSubmit = () => {
        put(route("admin.website.page.update", page.id));
    };

    const headerActions = [
        {
            label: PageConfig.pages.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.page.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pages.pages.edit.title}
                    description={`「${page.title}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={PageConfig.pages.breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.pages.pages.edit.title} - ${page.title}`}
            />

            <FlashMessage />

            <div className="w-full space-y-6">
                <PageForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.website.page.index")}
                    pageTypes={pageTypes}
                    isEdit={true}
                />

                <PageSectionsManager page={page} mediaList={mediaList} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
