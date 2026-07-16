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
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({
    statuses,
    itemTypes,
    services,
    benefitTypes,
    service_id,
}) {
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
        benefit_type: "",
        benefit_ticket_count: "",
        benefit_unit_minutes: "",
        sort_order: 0,
        status: "active",
    });

    const submit = () => {
        post(route("admin.service.item.store"));
    };

    const headerActions = [
        {
            label: PageConfig.serviceItems.actions.back,
            route: route("admin.service.item.index"),
            variant: "ghost",
            icon: ArrowLeftIcon,
        },
    ];

    const breadcrumbs = [
        ...PageConfig.serviceItems.breadcrumbs,
        PageConfig.serviceItems.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.serviceItems.pages.create.title}
                    description={
                        PageConfig.serviceItems.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.serviceItems.pages.create.title} />

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
                    benefitTypes={benefitTypes}
                    mode="create"
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
