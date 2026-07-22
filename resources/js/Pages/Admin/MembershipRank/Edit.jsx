import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import MembershipRankForm from "./_components/Form";

export default function Edit({ membershipRank }) {
    const { data, setData, put, processing, errors } = useForm({
        key: membershipRank.key || "",
        name: membershipRank.name || "",
        min_annual_amount: membershipRank.min_annual_amount ?? "",
        sort_order: membershipRank.sort_order ?? 0,
        description: membershipRank.description || "",
        is_active: membershipRank.is_active ?? true,
    });

    const handleSubmit = () => {
        put(route("admin.membership-rank.update", membershipRank.id));
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
        PageConfig.membershipRanks.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.membershipRanks.pages.edit.title}
                    description={`「${membershipRank.name}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.membershipRanks.pages.edit.title} - ${membershipRank.name}`}
            />

            <FlashMessage />

            <div className="max-w-4xl">
                <MembershipRankForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.membership-rank.index")}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
