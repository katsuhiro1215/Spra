import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import CampaignForm from "./_components/Form";

const toDatetimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function Edit({ campaign, discountTypes = {}, servicePlans = [] }) {
    // ========================================
    // State & Form
    // ========================================
    const { data, setData, put, processing, errors } = useForm({
        name: campaign.name || "",
        code: campaign.code || "",
        description: campaign.description || "",
        discount_type: campaign.discount_type || "percentage",
        discount_value: campaign.discount_value || "",
        usage_limit: campaign.usage_limit ?? "",
        starts_at: toDatetimeLocal(campaign.starts_at),
        ends_at: toDatetimeLocal(campaign.ends_at),
        is_active: campaign.is_active ?? true,
        service_plan_ids: (campaign.applicablePlans || []).map(
            (plan) => plan.id,
        ),
    });

    const handleSubmit = () => {
        put(route("admin.campaign.update", campaign.id));
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
        PageConfig.campaigns.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.campaigns.pages.edit.title}
                    description={`「${campaign.name}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.campaigns.pages.edit.title} - ${campaign.name}`}
            />

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
                    servicePlans={servicePlans}
                    usedCount={campaign.used_count || 0}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
