import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Quote Components
import QuoteForm from "./_components/Form";

export default function Edit({
    quote,
    users,
    serviceCategories,
    services,
    serviceItems,
    servicePlans,
}) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: quote.user_id || "",
        contact_id: quote.contact_id || "",
        company_id: quote.company_id || "",
        title: quote.title || "",
        requirements: quote.requirements || "",
        custom_specifications:
            typeof quote.current_version?.custom_specifications === "string"
                ? quote.current_version.custom_specifications
                : quote.current_version?.custom_specifications
                  ? JSON.stringify(quote.current_version.custom_specifications)
                  : "",
        status: quote.status || "draft",
        discount_amount: quote.current_version?.discount_amount || 0,
        tax_rate: quote.current_version?.tax_rate || 10,
        base_amount: quote.current_version?.base_amount || 0,
        tax_amount: quote.current_version?.tax_amount || 0,
        total_amount: quote.current_version?.total_amount || 0,
        items: quote.current_version?.items || [],
    });

    const submit = () => {
        const submitData = {
            ...data,
            custom_specifications: data.custom_specifications
                ? JSON.stringify(data.custom_specifications)
                : null,
        };
        put(route("admin.quote.update", quote.id), {
            data: submitData,
        });
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.quotes.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.quote.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.quotes.breadcrumbs,
        quote.quote_number,
        PageConfig.quotes.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`見積もり編集: ${quote.quote_number}`}
                    description="見積もり情報を編集します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`見積もり編集 - ${quote.quote_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full">
                <QuoteForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.quote.show", quote.id)}
                    users={users}
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
