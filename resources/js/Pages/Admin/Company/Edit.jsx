import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FlashMessage } from "@/Components/Notifications";
import CompanyForm from "./_components/CompanyForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({ company, companyTypes, statuses }) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || "",
        company_type: company.company_type || "corporate",
        legal_name: company.legal_name || "",
        registration_number: company.registration_number || "",
        tax_number: company.tax_number || "",
        phone: company.phone || "",
        fax: company.fax || "",
        email: company.email || "",
        website: company.website || "",
        representative_name: company.representative_name || "",
        representative_title: company.representative_title || "",
        representative_email: company.representative_email || "",
        representative_phone: company.representative_phone || "",
        business_description: company.business_description || "",
        industry: company.industry || "",
        employee_count: company.employee_count || "",
        capital: company.capital || "",
        established_date: company.established_date
            ? company.established_date.split(" ")[0]
            : "",
        status: company.status || "active",
        notes: company.notes || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.company.update", company.id));
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
    // Constants - Header Actions & Breadcrumbs
    // ========================================

    const headerActions = [
        {
            label: PageConfig.companies.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.company.show", company.id),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.companies.breadcrumbs,
        company.name,
        PageConfig.companies.pages.edit.breadcrumb,
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
            <Head title={`${company.name} - 編集`} />

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
                            href={route("admin.company.show", company.id)}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            更新する
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
