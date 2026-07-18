import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PageTypeForm from "./_components/PageTypeForm";
import * as validation from "./_components/validation";

export default function Create() {
    // ========================================
    // State & Form
    // ========================================
    const { data, setData, post, processing, errors } = useForm({
        key: "",
        name: "",
        slug: "",
        description: "",
        is_system: false,
        is_dynamic: false,
        has_detail: false,
        allowed_component_types: [],
        default_layout: {},
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = () => {
        // バリデーション
        const tempData = { ...data, errors: {} };
        validation.validatePageTypeForm(tempData);

        if (validation.hasPageTypeFormErrors(tempData.errors)) {
            setLocalErrors(tempData.errors);
            return;
        }

        post(route("admin.website.page.type.store"));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.pageTypes.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.page.type.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.pageTypes.breadcrumbs,
        PageConfig.pageTypes.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pageTypes.pages.create.title}
                    description={PageConfig.pageTypes.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pageTypes.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <PageTypeForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    localErrors={localErrors}
                    setLocalErrors={setLocalErrors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.website.page.type.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
