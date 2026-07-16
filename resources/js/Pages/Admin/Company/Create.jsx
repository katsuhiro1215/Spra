import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import CompanyForm from "./_components/CompanyForm";

export default function Create({ companyTypes, statuses }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        company_type: "corporate",
        legal_name: "",
        registration_number: "",
        tax_number: "",
        phone: "",
        fax: "",
        email: "",
        website: "",
        representative_name: "",
        representative_title: "",
        representative_email: "",
        representative_phone: "",
        business_description: "",
        industry: "",
        employee_count: "",
        capital: "",
        established_date: "",
        status: "active",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.company.store"));
    };
    // オプション変換
    const companyTypeOptions = Object.entries(companyTypes).map(
        ([value, label]) => ({
            value,
            label,
        }),
    );

    const statusOptions = Object.entries(statuses).map(([value, label]) => ({
        value,
        label,
    }));

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.companies.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.company.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.companies.breadcrumbs,
        PageConfig.companies.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.companies.title}
                    description={PageConfig.companies.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.companies.documentTitle} />

            <FlashMessage />

            <div className="max-w-7xl">
                <form onSubmit={submit} className="space-y-6">
                    {/* 企業情報 */}
                    <Card>
                        <CompanyForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            companyTypes={companyTypeOptions}
                            statuses={statusOptions}
                        />
                    </Card>

                    {/* アクションボタン */}
                    <div className="flex items-center justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            href={route("admin.company.index")}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            登録する
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
