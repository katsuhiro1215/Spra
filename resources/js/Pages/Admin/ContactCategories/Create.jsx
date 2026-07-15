import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Contact Components
import CategoryForm from "./_components/Form";

export default function Create() {
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
        PageConfig.contactCategories.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contactCategories.title}
                    description={PageConfig.contactCategories.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`カテゴリを作成 - ${PageConfig.contactCategories.documentTitle}`}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl">
                <CategoryForm />
            </div>
        </AdminAuthenticatedLayout>
    );
}
