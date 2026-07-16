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

export default function Create({ pageTypes }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        page_type_id: "",
        title: "",
        slug: "",
        content: { blocks: [] },
        meta_title: "",
        meta_description: "",
        is_published: false,
        sort_order: 0,
    });

    const handleSubmit = () => {
        post(route("admin.website.page.store"), {
            onSuccess: () => {
                reset();
            },
        });
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
                    title={PageConfig.pages.pages.create.title}
                    description={PageConfig.pages.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.pages.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pages.pages.create.title} />

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
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
