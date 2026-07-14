import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// ServiceItem Components
import ServiceItemForm from "./_components/Form";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Create({ statuses, itemTypes, services, service_id }) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: service_id || "",
        name: "",
        slug: "",
        description: "",
        item_type: "included",
        standard_price: "",
        internal_cost: "",
        estimated_days: "",
        estimated_hours: "",
        sort_order: 0,
        status: "active",
    });

    const submit = () => {
        post(route("admin.service.item.store"));
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            href: route("admin.service.item.index"),
            variant: "ghost",
            icon: ArrowLeftIcon,
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービス項目作成"
                    description="新しいサービス項目を作成します"
                    actions={headerActions}
                />
            }
        >
            <Head title="サービス項目作成" />

            <FlashMessage />

            <div className="max-w-7xl mx-auto">
                <ServiceItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.item.index")}
                    statuses={statuses}
                    itemTypes={itemTypes}
                    services={services}
                    mode="create"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
