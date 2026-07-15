import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import QuoteItemForm from "./_components/Form";

export default function Create({
    quote,
    serviceCategories,
    services,
    serviceItems,
    servicePlans,
    discount_amount,
    tax_rate,
    base_amount,
    tax_amount,
    total_amount,
    custom_specifications,
}) {
    const { data, setData, post, processing, errors } = useForm({
        items: [],
        discount_amount: discount_amount || 0,
        tax_rate: tax_rate || 10,
        base_amount: base_amount || 0,
        tax_amount: tax_amount || 0,
        total_amount: total_amount || 0,
        custom_specifications: custom_specifications || "",
    });

    const submit = () => {
        post(route("admin.quote.item.store", quote.id));
    };

    const headerActions = [
        {
            label: PageConfig.quotes.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.show", quote.id),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.quotes.breadcrumbs,
        quote.title,
        "見積明細追加",
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="見積明細追加"
                    description={`${quote.quote_number} - ${quote.title}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="見積明細追加" />

            <FlashMessage />

            <div className="w-full">
                <QuoteItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.quote.show", quote.id)}
                    serviceCategories={serviceCategories}
                    services={services}
                    serviceItems={serviceItems}
                    servicePlans={servicePlans}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
