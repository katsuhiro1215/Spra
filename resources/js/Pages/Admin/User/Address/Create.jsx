import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AddressForm from "./_components/Form";

export default function Create({ user, types }) {
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
        post(route("admin.user.address.store", user.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "ユーザー詳細に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.user.show", user.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "ユーザー一覧", href: route("admin.user.index") },
        { label: "ユーザー詳細", href: route("admin.user.show", user.id) },
        { label: "住所追加", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="住所追加"
                    description={`${user.email} の住所を追加します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`住所追加 - ${user.email}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl">
                <AddressForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.user.show", user.id)}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
