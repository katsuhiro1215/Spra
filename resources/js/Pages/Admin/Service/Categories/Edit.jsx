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

export default function Edit({ serviceCategory }) {
    const { data, setData, put, processing, errors } = useForm({
        name: serviceCategory.name || "",
        slug: serviceCategory.slug || "",
        description: serviceCategory.description || "",
        color:
            serviceCategory.color ||
            CommonUIConstants.serviceCategory.defaults.color,
        icon: serviceCategory.icon || "",
        sort_order:
            serviceCategory.sort_order ||
            CommonUIConstants.serviceCategory.defaults.sortOrder,
        status:
            serviceCategory.status ||
            CommonUIConstants.serviceCategory.defaults.status,
    });

    const submit = () => {
        put(route("admin.service.categories.update", serviceCategory.id));
    };

    const headerActions = [
        {
            label: PageConfig.serviceCategories.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.categories.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`${PageConfig.serviceCategories.pages.edit.title}: ${serviceCategory.name}`}
                    description={
                        PageConfig.serviceCategories.pages.edit.description
                    }
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.serviceCategories.breadcrumbs,
                        PageConfig.serviceCategories.pages.edit.breadcrumb,
                    ]}
                />
            }
        >
            <Head
                title={`${PageConfig.serviceCategories.pages.edit.title} - ${serviceCategory.name}`}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ServiceCategoryForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={submit}
                        cancelRoute={route("admin.service.categories.index")}
                        isEdit={true}
                    />
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
