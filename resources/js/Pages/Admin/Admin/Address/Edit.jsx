import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import ConfirmAlert from "@/Components/Alerts/ConfirmAlert";
import AddressForm from "./_components/Form";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Edit({ admin, address, types, isOtherAdmin }) {
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

    const [showConfirm, setShowConfirm] = useState(isOtherAdmin);

    const handleSubmit = () => {
        put(
            route("admin.admins.address.update", {
                admin: admin.id,
                address: address.id,
            }),
        );
    };

    const handleConfirm = () => {
        setShowConfirm(false);
    };

    const handleCancel = () => {
        router.visit(route("admin.admins.show", admin.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "管理者詳細に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.admins.show", admin.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "管理者一覧", href: route("admin.admin.index") },
        { label: "管理者詳細", href: route("admin.admin.show", admin.id) },
        { label: "住所編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="住所編集"
                    description={`${admin.email} の住所を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`住所編集 - ${admin.email}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 確認アラート */}
            <ConfirmAlert
                isOpen={showConfirm}
                title="確認"
                message={`他の管理者（${admin.email}）の住所を更新しようとしています。\n続行しますか？`}
                confirmText="続行"
                cancelText="戻る"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onClose={() => {}}
            />

            <div className="max-w-4xl">
                <AddressForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.admins.show", admin.id)}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
