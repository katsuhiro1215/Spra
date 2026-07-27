import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AtlasMembershipForm from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        brand: "concierge",
        status: "pending",
        note: "",
    });

    const handleSubmit = () => {
        post(route("admin.atlas-membership.store"));
    };

    const headerActions = [
        {
            label: "一覧へ戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.atlas-membership.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="Atlas会員を追加"
                    description="既存ユーザーにAtlas会員資格を付与します"
                    actions={headerActions}
                    breadcrumbs={[
                        {
                            label: "Atlas会員管理",
                            href: route("admin.atlas-membership.index"),
                        },
                        { label: "追加" },
                    ]}
                />
            }
        >
            <Head title="Atlas会員を追加" />

            <FlashMessage />

            <div className="max-w-4xl">
                <AtlasMembershipForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.atlas-membership.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
