import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Edit({ category }) {
    const breadcrumbs = [
        ...PageConfig.contactCategories.breadcrumbs,
        {
            label: category.name,
            route: route("admin.contact.category.edit", category.id),
        },
    ];

    const headerActions = [
        {
            label: PageConfig.contactCategories.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contact.category.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`カテゴリを編集: ${category.name}`}
                    description={PageConfig.contactCategories.description}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title={`カテゴリを編集 - ${category.name}`} />

            <div className="max-w-2xl">
                <Form category={category} isEditing={true} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
