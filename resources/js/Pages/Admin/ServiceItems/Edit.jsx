import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ServiceItemForm from "./_components/Form";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({
    serviceItem,
    statuses,
    itemTypes,
    services,
    benefitTypes,
}) {
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
        benefit_type: serviceItem.benefit_type || "",
        benefit_ticket_count: serviceItem.benefit_ticket_count ?? "",
        benefit_unit_minutes: serviceItem.benefit_unit_minutes ?? "",
        sort_order: serviceItem.sort_order || 0,
        status: serviceItem.status || "active",
    });

    const submit = () => {
        put(route("admin.service.item.update", serviceItem.id));
    };

    const headerActions = [
        {
            label: PageConfig.serviceItems.actions.back,
            route: route("admin.service.item.show", serviceItem.id),
            variant: "ghost",
            icon: ArrowLeftIcon,
        },
    ];

    const breadcrumbs = [
        ...PageConfig.serviceItems.breadcrumbs,
        serviceItem.name,
        PageConfig.serviceItems.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.serviceItems.pages.edit.title}
                    description={`"${serviceItem.name}" を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.serviceItems.pages.edit.title} - ${serviceItem.name}`}
            />

            <FlashMessage />

            <div className="max-w-7xl mx-auto">
                <ServiceItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route(
                        "admin.service.item.show",
                        serviceItem.id,
                    )}
                    statuses={statuses}
                    itemTypes={itemTypes}
                    services={services}
                    benefitTypes={benefitTypes}
                    mode="edit"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
