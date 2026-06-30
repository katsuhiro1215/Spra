import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import SearchFilter from "@/Components/Layout/SearchFilter";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { PlusIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// ServiceItem Components
import ServiceItemsTable from "./_components/ServiceItemsTable";

export default function Index({
    serviceItems,
    statuses,
    itemTypes,
    services,
    servicePlans,
    filters: initialFilters,
}) {
    const [data, setData] = useState(
        initialFilters || {
            search: "",
            status: "",
            service_id: "",
            service_plan_id: "",
            item_type: "",
        },
    );
    const [processing, setProcessing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    // データ更新用のヘルパー関数
    const updateData = (key, value) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // 検索実行
    const handleSearch = () => {
        setProcessing(true);
        router.get(route("admin.service.item.index"), data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setProcessing(false),
        });
    };

    // フィルター適用（debounce付き）
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route("admin.service.item.index"), data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [data]);

    const handleDelete = (serviceItem) => {
        if (!window.confirm("このサービス項目を削除しますか？")) {
            return;
        }

        setIsDeleting(serviceItem.id);

        router.delete(
            route("admin.service.service-items.destroy", serviceItem.id),
            {
                preserveScroll: true,
                onFinish: () => setIsDeleting(null),
            },
        );
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス管理", href: null },
        { label: "サービス項目一覧", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl leading-tight">
                    サービス項目一覧
                </h2>
            }
        >
            <Head title="サービス項目一覧" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title="サービス項目一覧"
                        description="サービスの個別項目とオプションを管理します"
                        breadcrumbs={breadcrumbs}
                        action={
                            <Link
                                href={route("admin.service.item.create")}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                新規作成
                            </Link>
                        }
                    />

                    {/* 検索とフィルター */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <SearchFilter
                            value={data.search}
                            onChange={(value) => updateData("search", value)}
                            placeholder="項目名で検索..."
                        />

                        <select
                            value={data.service_id}
                            onChange={(e) =>
                                updateData("service_id", e.target.value)
                            }
                            className="border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">すべてのサービス</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.service_plan_id}
                            onChange={(e) =>
                                updateData("service_plan_id", e.target.value)
                            }
                            className="border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">すべてのプラン</option>
                            {servicePlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.item_type}
                            onChange={(e) =>
                                updateData("item_type", e.target.value)
                            }
                            className="border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">すべてのタイプ</option>
                            {itemTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.status}
                            onChange={(e) =>
                                updateData("status", e.target.value)
                            }
                            className="border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">すべてのステータス</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* テーブル */}
                    <ServiceItemsTable
                        serviceItems={serviceItems.data}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />

                    {/* ページネーション */}
                    <div className="mt-6">
                        <Pagination links={serviceItems.links} />
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
