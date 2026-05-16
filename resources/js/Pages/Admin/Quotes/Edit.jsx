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

export default function Edit({ quote }) {
    const { data, setData, put, processing, errors } = useForm({
        title: quote.title || "",
        status: quote.status || "draft",
        expires_at: quote.expires_at || "",
        client_name: quote.client_name || "",
        client_company: quote.client_company || "",
        client_email: quote.client_email || "",
        client_phone: quote.client_phone || "",
        client_address: quote.client_address || "",
        requirements: quote.requirements || "",
        discount_amount: quote.discount_amount || 0,
        tax_rate: quote.tax_rate || 0.1,
        base_amount: quote.base_amount || 0,
        tax_amount: quote.tax_amount || 0,
        total_amount: quote.total_amount || 0,
        items: quote.items || [],
    });

    const submit = () => {
        put(route("admin.quote.update", quote.id));
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
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
