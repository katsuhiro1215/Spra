import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import MembershipRankForm from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        key: "",
        name: "",
        min_annual_amount: "",
        sort_order: 0,
        description: "",
        is_active: true,
    });

    const handleSubmit = () => {
        post(route("admin.membership-rank.store"));
    };

    const headerActions = [
        {
            label: PageConfig.membershipRanks.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.membership-rank.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.membershipRanks.breadcrumbs,
        PageConfig.membershipRanks.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.membershipRanks.pages.create.title}
                    description={
                        PageConfig.membershipRanks.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.membershipRanks.pages.create.title} />

            <FlashMessage />

            <div className="max-w-4xl">
                <MembershipRankForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.membership-rank.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
