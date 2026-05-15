import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import InvoiceForm from "./_components/Form";

export default function Edit({ invoice, contracts, users, companies, statuses }) {
    const { data, setData, put, processing, errors } = useForm({
        title: invoice.title || "",
        contract_id: invoice.contract_id || "",
        user_id: invoice.user_id || "",
        company_id: invoice.company_id || "",
        billing_period_start: invoice.billing_period_start || "",
        billing_period_end: invoice.billing_period_end || "",
        due_date: invoice.due_date || "",
        status: invoice.status || "draft",
        subtotal: invoice.subtotal || 0,
        discount_amount: invoice.discount_amount || 0,
        tax_rate: invoice.tax_rate || 0.1,
        tax_amount: invoice.tax_amount || 0,
        total_amount: invoice.total_amount || 0,
        notes: invoice.notes || "",
        items: invoice.items || [
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
        put(route("admin.invoice.update", invoice.id));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "請求書一覧", href: route("admin.invoice.index") },
        { label: "請求書編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="請求書編集"
                    description={`請求書「${invoice.invoice_number || invoice.id.substring(0, 8)}」を編集します`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書編集" />

            <FlashMessage />

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                <InvoiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.invoice.show", invoice.id)}
                    isEdit={true}
                    contracts={contracts}
                    users={users}
                    companies={companies}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
