import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// ServiceItem Components
import ServiceItemForm from "./_components/Form";

export default function Create({
    statuses,
    itemTypes,
    services,
    servicePlans,
    service_id,
    service_plan_id,
}) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: service_id || "",
        service_plan_id: service_plan_id || "",
        item_type: "included",
        name: "",
        description: "",
        price: "",
        estimated_days: "",
        is_required: false,
        sort_order: 0,
        status: "active",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.service.item.store"));
    };

    const handleCancel = () => {
        router.visit(route("admin.service.item.index"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス管理", href: null },
        {
            label: "サービス項目一覧",
            href: route("admin.service.item.index"),
        },
        { label: "新規作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービス項目作成"
                    description="新しいサービス項目を作成します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="サービス項目作成" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit}>
                    <ServiceItemForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        statuses={statuses}
                        itemTypes={itemTypes}
                        services={services}
                        servicePlans={servicePlans}
                        mode="create"
                    />

                    <div className="mt-6 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {processing ? "作成中..." : "作成"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
