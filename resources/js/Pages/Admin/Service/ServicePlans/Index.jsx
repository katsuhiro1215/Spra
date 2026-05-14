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
// ServicePlan Components
import ServicePlansTable from "./_components/ServicePlansTable";

export default function Index({
    servicePlans,
    statuses,
    billingCycles,
    services,
    filters: initialFilters,
}) {
    const [data, setData] = useState(
        initialFilters || {
            search: "",
            status: "",
            service_id: "",
            is_featured: "",
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
        router.get(route("admin.service.service-plans.index"), data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setProcessing(false),
        });
    };

    // フィルター適用（debounce付き）
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route("admin.service.service-plans.index"), data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [data]);

    const handleDelete = (servicePlan) => {
        if (
            confirm(
                `「${servicePlan.name}」を削除しますか？この操作は取り消せません。`,
            )
        ) {
            setIsDeleting(servicePlan.id);
            router.delete(
                route("admin.service.service-plans.destroy", servicePlan.id),
                {
                    onFinish: () => setIsDeleting(null),
                },
            );
        }
    };

    // フィルター設定を作成
    const searchFilterConfig = [
        {
            key: "service_id",
            label: "サービス",
            placeholder: "すべてのサービス",
            options: (services || []).map((service) => ({
                value: service.id,
                label: service.name,
            })),
        },
        {
            key: "status",
            label: "ステータス",
            placeholder: "すべてのステータス",
            options: (statuses || []).map((status) => ({
                value: status.value,
                label: status.label,
            })),
        },
    ];

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "サービスプランを追加",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.service-plans.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "サービス管理", href: null },
        { label: "サービスプラン一覧", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="サービスプラン管理"
                    description="サービスプランの作成、編集、削除を行います"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="サービスプラン一覧" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <SearchFilter
                            data={data}
                            updateData={updateData}
                            config={searchFilterConfig}
                            onSearch={handleSearch}
                            processing={processing}
                        />

                        <ServicePlansTable
                            servicePlans={servicePlans.data || []}
                            onDelete={handleDelete}
                            isDeleting={isDeleting}
                            billingCycles={billingCycles}
                        />

                        {servicePlans.last_page > 1 && (
                            <div className="mt-6">
                                <Pagination links={servicePlans.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
