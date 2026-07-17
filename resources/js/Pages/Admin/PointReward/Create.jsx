import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import PointRewardForm from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        code: "",
        name: "",
        points: "",
        description: "",
        is_active: true,
    });

    const handleSubmit = () => {
        post(route("admin.point-reward.store"));
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
        PageConfig.pointRewards.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.pointRewards.pages.create.title}
                    description={
                        PageConfig.pointRewards.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.pointRewards.pages.create.title} />

            <FlashMessage />

            <div className="max-w-4xl">
                <PointRewardForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.point-reward.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
