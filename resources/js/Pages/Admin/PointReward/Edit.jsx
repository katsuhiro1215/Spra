import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PointRewardForm from "./_components/Form";

export default function Edit({ pointReward }) {
    const { data, setData, put, processing, errors } = useForm({
        code: pointReward.code || "",
        name: pointReward.name || "",
        points: pointReward.points ?? "",
        description: pointReward.description || "",
        is_active: pointReward.is_active ?? true,
    });

    const handleSubmit = () => {
        put(route("admin.point-reward.update", pointReward.id));
    };

    const headerActions = [
        {
            label: PageConfig.pointRewards.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.point-reward.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.pointRewards.breadcrumbs,
        PageConfig.pointRewards.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pointRewards.pages.edit.title}
                    description={`「${pointReward.name}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.pointRewards.pages.edit.title} - ${pointReward.name}`}
            />

            <FlashMessage />

            <div className="max-w-4xl">
                <PointRewardForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.point-reward.index")}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
