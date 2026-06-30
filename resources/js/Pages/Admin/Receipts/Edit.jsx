import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ReceiptForm from "./_components/Form";

export default function Edit({
    receipt,
    invoices,
    users,
    companies,
    statuses,
}) {
    const { data, setData, put, processing, errors } = useForm({
        invoice_id: receipt.invoice_id || "",
        payment_id: receipt.payment_id || "",
        user_id: receipt.user_id || "",
        company_id: receipt.company_id || "",
        amount: receipt.amount || 0,
        tax_amount: receipt.tax_amount || 0,
        total_amount: receipt.total_amount || 0,
        status: receipt.status || "draft",
        issued_at: receipt.issued_at
            ? new Date(receipt.issued_at).toISOString().split("T")[0]
            : "",
        notes: receipt.notes || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.receipts.update", receipt.id));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "領収書一覧", href: route("admin.receipts.index") },
        {
            label: receipt.receipt_number,
            href: route("admin.receipts.show", receipt.id),
        },
        { label: "編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`領収書編集: ${receipt.receipt_number}`}
                    description="領収書情報を編集します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`領収書編集: ${receipt.receipt_number}`} />

            <FlashMessage />

            <ReceiptForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                invoices={invoices}
                users={users}
                companies={companies}
                statuses={statuses}
                isEdit={true}
            />
        </AdminAuthenticatedLayout>
    );
}
