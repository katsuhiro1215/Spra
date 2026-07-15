import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { PageConfig } from "@/Constants/PageConfig";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Contract Components
import ContractForm from "./_components/Form";

export default function Edit({
    contract,
    projects,
    users,
    companies,
    services,
    quotes,
    statuses,
    quote = null,
}) {
    const currentVersion = contract.current_version;

    const { data, setData, put, processing, errors } = useForm({
        title: contract.title || "",
        status: contract.status || "draft",
        description: contract.description || "",
        service_id: contract.service_id || "",
        discount_amount: currentVersion?.discount_amount ?? "",
        tax_rate: currentVersion?.tax_rate ?? "10",
        start_date: contract.start_date || "",
        end_date: contract.end_date || "",
        terms_and_conditions: currentVersion?.terms_and_conditions || "",
        notes: currentVersion?.notes || "",
    });

    const submit = () => {
        put(route("admin.contract.update", contract.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.contracts.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.show", contract.id),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contracts.breadcrumbs,
        contract.contract_number || contract.title,
        PageConfig.contracts.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contracts.pages.edit.title}
                    description={`契約「${contract.title}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${PageConfig.contracts.pages.edit.title} - ${contract.title}`} />

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
                    services={services}
                    quotes={quotes}
                    quote={quote}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
