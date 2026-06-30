import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ReceiptForm from "./_components/Form";

export default function Create({
    invoices,
    users,
    companies,
    statuses,
    invoice = null,
    payment = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: "",
        payment_id: "",
        user_id: "",
        company_id: "",
        amount: 0,
        tax_amount: 0,
        total_amount: 0,
        status: "draft",
        issued_at: "",
        notes: "",
    });

    // コンテキストベースの初期化
    useEffect(() => {
        if (invoice) {
            setData((prev) => ({
                ...prev,
                invoice_id: invoice.id,
                user_id: invoice.user_id || "",
                company_id: invoice.company_id || "",
                amount: invoice.subtotal || 0,
                tax_amount: invoice.tax_amount || 0,
                total_amount: invoice.total_amount || 0,
            }));
        }

        if (payment) {
            setData((prev) => ({
                ...prev,
                payment_id: payment.id,
                invoice_id: payment.invoice?.id || prev.invoice_id,
            }));
        }
    }, [invoice, payment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.receipts.store"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "領収書一覧", href: route("admin.receipts.index") },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="領収書作成"
                    description="新しい領収書を作成します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="領収書作成" />

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
                isEdit={false}
            />
        </AdminAuthenticatedLayout>
    );
}
