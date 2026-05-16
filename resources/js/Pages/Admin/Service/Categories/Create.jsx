import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";
// ServiceCategory Components
import ServiceCategoryForm from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        color: CommonUIConstants.serviceCategory.defaults.color,
        icon: "",
        sort_order: CommonUIConstants.serviceCategory.defaults.sortOrder,
        status: CommonUIConstants.serviceCategory.defaults.status,
    });

    const submit = () => {
        post(route("admin.service.category.store"));
    };

    const headerActions = [
        {
            label: PageConfig.serviceCategories.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.category.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.serviceCategories.pages.create.title}
                    description={
                        PageConfig.serviceCategories.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.serviceCategories.breadcrumbs,
                        PageConfig.serviceCategories.pages.create.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={PageConfig.serviceCategories.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <ServiceCategoryForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.category.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
