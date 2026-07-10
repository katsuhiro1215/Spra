import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import Form from "./_components/Form";

export default function Create() {
    const breadcrumbs = [
        ...PageConfig.contactCategories.breadcrumbs,
        {
            label: "新規作成",
            route: route("admin.contact.category.create"),
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
                    title="新しいカテゴリを作成"
                    description={PageConfig.contactCategories.description}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title="カテゴリを作成 - お問い合わせ管理" />

            <div className="max-w-2xl">
                <Form />
            </div>
        </AdminAuthenticatedLayout>
    );
}
