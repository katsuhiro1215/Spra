import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Contract Components
import ContractForm from "./_components/Form";

export default function Create({
    projects,
    users,
    companies,
    quotes,
    statuses,
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        status: "draft",
        type: "one_time",
        description: "",
        user_id: "",
        company_id: "",
        project_id: "",
        quote_id: "",
        amount: "",
        tax_rate: "10",
        start_date: "",
        end_date: "",
        auto_renewal: false,
        renewal_notice_days: "30",
        payment_terms: "",
        terms_and_conditions: "",
        notes: "",
    });

    const submit = () => {
        post(route("admin.contract.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約新規作成"
                    description="新しい契約を作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約新規作成" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <ContractForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.contract.index")}
                    isEdit={false}
                    projects={projects}
                    users={users}
                    companies={companies}
                    quotes={quotes}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
