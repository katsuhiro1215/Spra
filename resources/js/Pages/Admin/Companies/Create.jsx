import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import CompanyForm from "./_components/CompanyForm";
import AddressFormSection from "./_components/AddressFormSection";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ companyTypes, statuses, addressTypes }) {
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
        addresses: [],
    });

    const [addressData, setAddressData] = useState({
        type: "office",
        label: "",
        postal_code: "",
        prefecture: "",
        city: "",
        district: "",
        address_other: "",
        phone: "",
        contact_person: "",
        is_default: true,
        is_active: true,
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();

        // 住所データを配列に追加して送信
        const formData = {
            ...data,
            addresses: [addressData],
        };

        post(route("admin.company.store"), {
            data: formData,
        });
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

    const addressTypeOptions = Object.entries(addressTypes).map(
        ([value, label]) => ({
            value,
            label,
        }),
    );

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.companies.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.company.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "企業管理", href: route("admin.company.index") },
        { label: "企業登録", href: null },
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
            <Head title="企業登録" />

            <FlashMessage />

            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6">
                    {/* 企業情報 */}
                    <Card>
                        <div className="p-6">
                            <CompanyForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                companyTypes={companyTypeOptions}
                                statuses={statusOptions}
                            />
                        </div>
                    </Card>

                    {/* 住所情報 */}
                    <Card>
                        <div className="p-6">
                            <AddressFormSection
                                addressData={addressData}
                                setAddressData={setAddressData}
                                errors={errors}
                                addressTypes={addressTypeOptions}
                                index={0}
                            />
                        </div>
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
