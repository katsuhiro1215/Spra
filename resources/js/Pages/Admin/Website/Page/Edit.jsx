import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Page Components
import PageForm from "./_components/PageForm";

export default function Edit({ page, pageTypes }) {
    const { data, setData, put, processing, errors } = useForm({
        page_type_id: page.page_type_id || "",
        title: page.title || "",
        slug: page.slug || "",
        content:
            page.content && page.content.blocks ? page.content : { blocks: [] },
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

            <div className="w-full">
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
            </div>
        </AdminAuthenticatedLayout>
    );
}
