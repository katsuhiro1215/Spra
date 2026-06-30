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
    serviceItems,
}) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: quote.user_id || "",
        contact_id: quote.contact_id || "",
        company_id: quote.company_id || "",
        title: quote.title || "",
        requirements: quote.requirements || "",
        expires_at: quote.expires_at || "",
        custom_specifications:
            typeof quote.custom_specifications === "string"
                ? quote.custom_specifications
                : quote.custom_specifications
                  ? JSON.stringify(quote.custom_specifications)
                  : "",
        status: quote.status || "draft",
        discount_amount: quote.discount_amount || 0,
        tax_rate: quote.tax_rate || 10,
        base_amount: quote.base_amount || 0,
        tax_amount: quote.tax_amount || 0,
        total_amount: quote.total_amount || 0,
        items: quote.items || [],
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
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "見積もり一覧", href: route("admin.quote.index") },
        {
            label: quote.quote_number,
            href: route("admin.quote.show", quote.id),
        },
        { label: "編集", href: null },
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

            <div className="max-w-7xl">
                <QuoteForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.quote.show", quote.id)}
                    users={users}
                    serviceCategories={serviceCategories}
                    serviceItems={serviceItems}
                    projectInquiry={null}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
