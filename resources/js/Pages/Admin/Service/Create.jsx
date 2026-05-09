import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
// Service Components
import ServiceForm from "./_components/Form";

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        service_category_id: "",
        description: "",
        details: "",
        icon: "",
        sort_order: 0,
        status: "active",
        is_featured: false,
    });

    const submit = () => {
        post(route("admin.service.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "サービス一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.service.index"),
        },
        {
            label: "サービスを追加",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス管理", href: route("admin.service.index") },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービス作成"
                    description="新しいサービスを作成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="サービス作成" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl">
                <ServiceForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    cancelRoute={route("admin.service.index")}
                    categories={categories}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
