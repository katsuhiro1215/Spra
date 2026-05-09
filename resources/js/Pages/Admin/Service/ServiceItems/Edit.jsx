import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// ServiceItem Components
import ServiceItemForm from "./_components/Form";

export default function Edit({
    serviceItem,
    statuses,
    itemTypes,
    services,
    servicePlans,
}) {
    const { data, setData, put, processing, errors } = useForm({
        service_id: serviceItem.service_id || "",
        service_plan_id: serviceItem.service_plan_id || "",
        item_type: serviceItem.item_type || "included",
        name: serviceItem.name || "",
        description: serviceItem.description || "",
        price: serviceItem.price || "",
        estimated_days: serviceItem.estimated_days || "",
        is_required: serviceItem.is_required || false,
        sort_order: serviceItem.sort_order || 0,
        status: serviceItem.status || "active",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.service.service-items.update", serviceItem.id));
    };

    const handleCancel = () => {
        router.visit(route("admin.service.service-items.index"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス管理", href: null },
        {
            label: "サービス項目一覧",
            href: route("admin.service.service-items.index"),
        },
        { label: "編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービス項目編集"
                    description="サービス項目の情報を編集します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="サービス項目編集" />

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
                        mode="edit"
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
                            {processing ? "更新中..." : "更新"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
