import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ContractItemForm from "./_components/Form";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({
    contract,
    serviceCategories,
    services,
    serviceItems,
    servicePlans,
    quoteItems = [],
    fromQuote = false,
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
        post(route("admin.contract.item.store", contract.id));
    };

    const headerActions = [
        {
            label: PageConfig.contracts.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.show", contract.id),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contracts.breadcrumbs,
        contract.title,
        "契約明細追加",
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約明細追加"
                    description={`${contract.contract_number} - ${contract.title}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約明細追加" />

            <FlashMessage />

            <div className="w-full">
                <ContractItemForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.contract.show", contract.id)}
                    serviceCategories={serviceCategories}
                    services={services}
                    serviceItems={serviceItems}
                    servicePlans={servicePlans}
                    quoteItems={quoteItems}
                    fromQuote={fromQuote}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
