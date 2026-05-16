import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Address Components
import AddressForm from "./_components/Form";

export default function Edit({ user, address, types }) {
    const { data, setData, put, processing, errors } = useForm({
        type: address.type || "office",
        label: address.label || "",
        postal_code: address.postal_code || "",
        prefecture: address.prefecture || "",
        city: address.city || "",
        district: address.district || "",
        address_other: address.address_other || "",
        phone: address.phone || "",
        contact_person: address.contact_person || "",
        notes: address.notes || "",
        latitude: address.latitude || "",
        longitude: address.longitude || "",
        is_default: address.is_default || false,
        is_active: address.is_active !== undefined ? address.is_active : true,
    });

    const handleSubmit = () => {
        put(
            route("admin.user.address.update", {
                user: user.id,
                address: address.id,
            }),
        );
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
        { label: "住所編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="住所編集"
                    description={`${user.email} の住所を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`住所編集 - ${user.email}`} />

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
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
