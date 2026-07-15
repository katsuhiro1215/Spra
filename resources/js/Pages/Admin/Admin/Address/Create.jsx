import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ConfirmAlert } from "@/Components/Alerts";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
// Address Component
import AddressForm from "./_components/Form";

export default function Create({ admin, types, isOtherAdmin }) {
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

    const [showConfirm, setShowConfirm] = useState(isOtherAdmin);

    const handleSubmit = () => {
        post(route("admin.admin.address.store", admin.id));
    };

    const handleConfirm = () => {
        setShowConfirm(false);
    };

    const handleCancel = () => {
        router.visit(route("admin.admin.show", admin.id));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.admins.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.admin.show", admin.id),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.admins.breadcrumbs,
        PageConfig.admins.pages.show.breadcrumb,
        PageConfig.adminAddresses.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.adminAddresses.pages.create.title}
                    description={`${admin.email} の住所を追加します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`住所追加 - ${admin.email}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 確認アラート */}
            <ConfirmAlert
                isOpen={showConfirm}
                title="確認"
                message={`他の管理者（${admin.email}）の住所を作成しようとしています。\n続行しますか？`}
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
                    cancelRoute={route("admin.admin.show", admin.id)}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
