import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ConfirmAlert } from "@/Components/Alerts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AddressForm from "./_components/Form";

export default function Create({ company, types }) {
    const { data, setData, post, processing, errors } = useForm({
        type: "office",
        label: "",
        postal_code: "",
        prefecture: "",
        city: "",
        district: "",
        address_other: "",
        phone: "",
        contact_person: "",
        notes: "",
        latitude: "",
        longitude: "",
        is_default: false,
        is_active: true,
    });

    const handleSubmit = () => {
        post(route("admin.company.address.store", company.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "会社詳細に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.company.show", company.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "会社一覧", href: route("admin.company.index") },
        { label: "会社詳細", href: route("admin.company.show", company.id) },
        { label: "住所追加", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="住所追加"
                    description={`${company.name} の住所を追加します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`住所追加 - ${company.name}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl">
                <AddressForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.company.show", company.id)}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
