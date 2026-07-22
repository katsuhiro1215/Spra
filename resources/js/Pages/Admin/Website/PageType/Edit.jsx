import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PageTypeForm from "./_components/PageTypeForm";
import * as validation from "./_components/validation";

export default function Edit({ pageType }) {
    // ========================================
    // State & Form
    // ========================================
    const { data, setData, put, processing, errors } = useForm({
        key: pageType.key || "",
        name: pageType.name || "",
        slug: pageType.slug || "",
        description: pageType.description || "",
        is_system: pageType.is_system || false,
        is_dynamic: pageType.is_dynamic || false,
        has_detail: pageType.has_detail || false,
        allowed_component_types: pageType.allowed_component_types || [],
        default_layout: pageType.default_layout || {},
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

        put(route("admin.website.page.type.update", pageType.id));
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
        PageConfig.pageTypes.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pageTypes.pages.edit.title}
                    description={`「${pageType.name}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.pageTypes.pages.edit.title} - ${pageType.name}`}
            />

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
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
