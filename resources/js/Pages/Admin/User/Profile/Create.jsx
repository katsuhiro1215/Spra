import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ConfirmAlert } from "@/Components/Alerts";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Profile Component
import ProfileForm from "./_components/Form";

export default function Create({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        last_name: user.profile?.last_name || "",
        first_name: user.profile?.first_name || "",
        last_name_kana: user.profile?.last_name_kana || "",
        first_name_kana: user.profile?.first_name_kana || "",
        display_name: user.profile?.display_name || "",
        birth_date: user.profile?.birth_date || "",
        gender: user.profile?.gender || "",
        phone: user.profile?.phone || "",
        mobile: user.profile?.mobile || "",
        emergency_contact_name: user.profile?.emergency_contact_name || "",
        emergency_contact_phone: user.profile?.emergency_contact_phone || "",
        bio: user.profile?.bio || "",
    });

    const handleSubmit = () => {
        post(route("admin.user.profile.store", user.id));
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
        { label: "ダッシュボード", href: route("admin.dashboard") },
        { label: "ユーザー一覧", href: route("admin.user.index") },
        { label: "ユーザー詳細", href: route("admin.user.show", user.id) },
        { label: "プロフィール作成" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="プロフィール作成"
                    description={`${user.email} のプロフィールを作成します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`プロフィール作成 - ${user.email}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-3xl">
                <ProfileForm
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
