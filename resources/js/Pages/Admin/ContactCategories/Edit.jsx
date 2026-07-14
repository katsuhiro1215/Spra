import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import CategoryForm from "./_components/Form";

export default function Edit({ category }) {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.contactCategories.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contact.category.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.contactCategories.breadcrumbs,
        PageConfig.contactCategories.pages.edit.breadcrumb,
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

            <div className="max-w-4xl">
                <CategoryForm category={category} isEditing={true} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
