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

export default function Edit({ serviceItem, statuses, itemTypes, services }) {
    const { data, setData, put, processing, errors } = useForm({
        service_id: serviceItem.service_id || "",
        name: serviceItem.name || "",
        slug: serviceItem.slug || "",
        description: serviceItem.description || "",
        item_type: serviceItem.item_type || "included",
        standard_price: serviceItem.standard_price || "",
        internal_cost: serviceItem.internal_cost || "",
        estimated_days: serviceItem.estimated_days || "",
        estimated_hours: serviceItem.estimated_hours || "",
        sort_order: serviceItem.sort_order || 0,
        status: serviceItem.status || "active",
    });

    const submit = () => {
        put(route("admin.service.item.update", serviceItem.id));
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
                    title="サービス項目編集"
                    description={`"${serviceItem.name}" を編集します`}
                    actions={headerActions}
                />
            }
        >
            <Head title="サービス項目編集" />

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
                    mode="edit"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
