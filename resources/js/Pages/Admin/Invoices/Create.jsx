import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import InvoiceForm from "./_components/Form";

export default function Create({ contracts, users, companies, statuses }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        contract_id: "",
        user_id: "",
        company_id: "",
        billing_period_start: "",
        billing_period_end: "",
        due_date: "",
        status: "draft",
        subtotal: 0,
        discount_amount: 0,
        tax_rate: 0.1,
        tax_amount: 0,
        total_amount: 0,
        notes: "",
        items: [
            {
                name: "",
                description: "",
                quantity: 1,
                unit_price: 0,
                amount: 0,
            },
        ],
    });

    const handleSubmit = () => {
        post(route("admin.invoice.store"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "請求書一覧", href: route("admin.invoice.index") },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="請求書作成"
                    description="新しい請求書を作成します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書作成" />

            <FlashMessage />

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                <InvoiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.invoice.index")}
                    isEdit={false}
                    contracts={contracts}
                    users={users}
                    companies={companies}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
