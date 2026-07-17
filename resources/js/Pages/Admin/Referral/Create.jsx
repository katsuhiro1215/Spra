import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ReferralForm from "./_components/Form";

export default function Create({ companies = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        referrer_company_id: "",
        referred_company_id: "",
        description: "",
    });

    const handleSubmit = () => {
        post(route("admin.referral.store"));
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
        PageConfig.referrals.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.referrals.pages.create.title}
                    description={PageConfig.referrals.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.referrals.pages.create.title} />

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
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
