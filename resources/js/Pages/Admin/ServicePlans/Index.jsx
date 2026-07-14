import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import SearchFilter from "@/Components/Layout/SearchFilter";
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
        router.get(route("admin.service.plan.index"), data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setProcessing(false),
        });
    };

    // フィルター適用（debounce付き）
    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route("admin.service.plan.index"), data, {
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
            router.delete(route("admin.service.plan.destroy", servicePlan.id), {
                onFinish: () => setIsDeleting(null),
            });
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
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.servicePlans.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.plan.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.servicePlans.pages.index.title}
                    description={
                        PageConfig.servicePlans.pages.index.description
                    }
                    actions={headerActions}
                    breadcrumbs={PageConfig.servicePlans.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.servicePlans.pages.index.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <Card>
                    <div className="p-4 space-y-4">
                        <SearchFilter
                            data={data}
                            updateData={updateData}
                            config={searchFilterConfig}
                            onSearch={handleSearch}
                            processing={processing}
                        />
                    </div>
                </Card>
                {/* サービスプラン一覧 */}
                <ServicePlansTable
                    servicePlans={servicePlans.data || []}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    billingCycles={billingCycles}
                />
                {/* ページネーション */}
                {servicePlans.data.length > 0 && (
                    <Pagination paginationData={servicePlans} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
