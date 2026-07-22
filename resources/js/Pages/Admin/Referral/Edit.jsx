import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ReferralForm from "./_components/Form";

const STATUSES = {
    pending: "未成約",
    expired: "期限切れ",
    cancelled: "取消",
};

export default function Edit({ referral, companies = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        referrer_company_id: referral.referrer_company_id || "",
        referred_company_id: referral.referred_company_id || "",
        status:
            referral.status === "contracted" ? "pending" : referral.status,
        description: referral.description || "",
    });

    const handleSubmit = () => {
        put(route("admin.referral.update", referral.id));
    };

    const headerActions = [
        {
            label: PageConfig.referrals.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.referral.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.referrals.breadcrumbs,
        PageConfig.referrals.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.referrals.pages.edit.title}
                    description={`「${referral.referral_code}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.referrals.pages.edit.title} - ${referral.referral_code}`}
            />

            <FlashMessage />

            <div className="max-w-4xl">
                <ReferralForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.referral.index")}
                    companies={companies}
                    statuses={STATUSES}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
