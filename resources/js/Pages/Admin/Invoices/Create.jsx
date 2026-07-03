import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import InvoiceForm from "./_components/Form";

export default function Create({
    contracts,
    users,
    companies,
    statuses,
    company = null,
    user = null,
    contract = null,
}) {
    const today = new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors } = useForm({
        contract_id: "",
        issue_date: today,
        user_id: "",
        company_id: "",
        billing_period_start: today,
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
                description: "",
                quantity: 1,
                unit_price: 0,
                amount: 0,
            },
        ],
    });

    // コンテキストベースの初期化
    useEffect(() => {
        if (company) {
            setData((prev) => ({
                ...prev,
                company_id: company.id,
                user_id:
                    company.users && company.users.length > 0
                        ? company.users[0].id
                        : "",
            }));
        }

        if (user) {
            setData((prev) => ({
                ...prev,
                user_id: user.id,
                company_id:
                    user.companies && user.companies.length > 0
                        ? user.companies[0].id
                        : "",
            }));
        }

        if (contract) {
            setData((prev) => ({
                ...prev,
                contract_id: contract.id,
                user_id: contract.user_id || "",
                company_id: contract.company_id || "",
            }));
        }
    }, [company, user, contract]);

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
