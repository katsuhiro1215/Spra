import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AtlasMembershipForm from "./_components/Form";

export default function Edit({ membership }) {
    const { data, setData, put, processing, errors } = useForm({
        brand: membership.brand,
        status: membership.status,
        note: membership.note || "",
    });

    const handleSubmit = () => {
        put(route("admin.atlas-membership.update", membership.id));
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
                    title="Atlas会員を編集"
                    description={membership.user?.email}
                    actions={headerActions}
                    breadcrumbs={[
                        {
                            label: "Atlas会員管理",
                            href: route("admin.atlas-membership.index"),
                        },
                        { label: "編集" },
                    ]}
                />
            }
        >
            <Head title="Atlas会員を編集" />

            <FlashMessage />

            <div className="max-w-4xl">
                <AtlasMembershipForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.atlas-membership.index")}
                    isEdit={true}
                    userEmail={membership.user?.email}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
