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

export default function Edit({
    contract,
    projects,
    users,
    companies,
    quotes,
    statuses,
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: contract.title || "",
        status: contract.status || "draft",
        type: contract.type || "one_time",
        description: contract.description || "",
        user_id: contract.user_id || "",
        company_id: contract.company_id || "",
        project_id: contract.project_id || "",
        quote_id: contract.quote_id || "",
        amount: contract.amount || "",
        tax_rate: contract.tax_rate || "10",
        start_date: contract.start_date || "",
        end_date: contract.end_date || "",
        auto_renewal: contract.auto_renewal || false,
        renewal_notice_days: contract.renewal_notice_days || "30",
        payment_terms: contract.payment_terms || "",
        terms_and_conditions: contract.terms_and_conditions || "",
        notes: contract.notes || "",
    });

    const submit = () => {
        put(route("admin.contract.update", contract.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.show", contract.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        {
            label: contract.contract_number || contract.title,
            href: route("admin.contract.show", contract.id),
        },
        { label: "編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約編集"
                    description={`契約「${contract.title}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`契約編集 - ${contract.title}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <ContractForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.contract.show", contract.id)}
                    isEdit={true}
                    projects={projects}
                    users={users}
                    companies={companies}
                    quotes={quotes}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
