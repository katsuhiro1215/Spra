import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import CampaignForm from "./_components/Form";

export default function Create({ discountTypes = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        starts_at: "",
        ends_at: "",
        is_active: true,
    });

    const handleSubmit = () => {
        post(route("admin.campaign.store"));
    };

    // ========================================
    // Constants
    // ========================================
    const headerActions = [
        {
            label: PageConfig.campaigns.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.campaign.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.campaigns.breadcrumbs,
        PageConfig.campaigns.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.campaigns.pages.create.title}
                    description={PageConfig.campaigns.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.campaigns.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl">
                <CampaignForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.campaign.index")}
                    discountTypes={discountTypes}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
