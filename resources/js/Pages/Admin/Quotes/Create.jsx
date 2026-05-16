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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        status: "draft",
        expires_at: "",
        client_name: "",
        client_company: "",
        client_email: "",
        client_phone: "",
        client_address: "",
        requirements: "",
        discount_amount: 0,
        tax_rate: 0.1,
        base_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        items: [
            {
                name: "",
                description: "",
                item_type: "service",
                billing_type: "one_time",
                quantity: 1,
                unit_price: 0,
                amount: 0,
                estimated_days: 0,
                sort_order: 0,
            },
        ],
    });

    const submit = () => {
        post(route("admin.quote.store"));
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
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="見積もり新規作成"
                    description="新しい見積もりを作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.quotes.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <QuoteForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.quote.index")}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
