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
// Profile Component
import ProfileForm from "./_components/Form";

export default function Edit({ admin, isOtherAdmin }) {
    const { data, setData, put, processing, errors } = useForm({
        last_name: admin.profile?.last_name || "",
        first_name: admin.profile?.first_name || "",
        last_name_kana: admin.profile?.last_name_kana || "",
        first_name_kana: admin.profile?.first_name_kana || "",
        display_name: admin.profile?.display_name || "",
        birth_date: admin.profile?.birth_date || "",
        gender: admin.profile?.gender || "",
        phone: admin.profile?.phone || "",
        mobile: admin.profile?.mobile || "",
        emergency_contact_name: admin.profile?.emergency_contact_name || "",
        emergency_contact_phone: admin.profile?.emergency_contact_phone || "",
        bio: admin.profile?.bio || "",
    });

    const [showConfirm, setShowConfirm] = useState(isOtherAdmin);

    const handleSubmit = () => {
        put(route("admin.admin.profile.update", admin.id));
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
        PageConfig.adminProfiles.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.adminProfiles.pages.edit.title}
                    description={`${admin.email} のプロフィールを編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`プロフィール編集 - ${admin.email}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 確認アラート */}
            <ConfirmAlert
                isOpen={showConfirm}
                title="確認"
                message={`他の管理者（${admin.email}）のプロフィールを編集しようとしています。\n続行しますか？`}
                confirmText="続行"
                cancelText="戻る"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onClose={() => {}}
            />

            <div className="max-w-3xl">
                <ProfileForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.admin.show", admin.id)}
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
