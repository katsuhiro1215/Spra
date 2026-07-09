import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import QuoteItemForm from "./_components/Form";

export default function Edit({
    quote,
    items,
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
    const { data, setData, put, processing, errors } = useForm({
        items: items || [],
        discount_amount: discount_amount || 0,
        tax_rate: tax_rate || 10,
        base_amount: base_amount || 0,
        tax_amount: tax_amount || 0,
        total_amount: total_amount || 0,
        custom_specifications: custom_specifications || "",
    });

    const submit = () => {
        put(route("admin.quote.item.update", quote.id));
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.show", quote.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        {
            label: quote.title,
            href: route("admin.quote.show", quote.id),
        },
        { label: "見積明細編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="見積明細編集"
                    description={`${quote.quote_number} - ${quote.title}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="見積明細編集" />

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
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
