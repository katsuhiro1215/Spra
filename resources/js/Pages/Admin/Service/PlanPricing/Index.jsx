import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

import StatsCards from "./Components/StatsCards";
import SearchFilters from "./Components/SearchFilters";
import PricingTable from "./Components/PricingTable";
import BulkActions from "./Components/BulkActions";
import { getTypeBadge, getBillingTypeBadge, getStatusBadge } from "./Components/PricingBadges";

export default function PlanPricingIndex({
    servicePlan,
    planPricings,
    stats,
    filters,
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 検索フォーム処理
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchParams = Object.fromEntries(formData.entries());
        
        router.get(
            route("admin.service.plans.pricing.index", [
                servicePlan.service_type_id,
                servicePlan.id,
            ]),
            searchParams,
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // フィルターリセット
    const handleReset = () => {
        router.get(
            route("admin.service.plans.pricing.index", [
                servicePlan.service_type_id,
                servicePlan.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // 全選択
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(planPricings.data.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    // 個別選択
    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // 一括削除
    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;

        if (
            confirm(
                `選択した${selectedItems.length}件の価格設定を削除しますか？`
            )
        ) {
            setIsProcessing(true);
            router.post(
                route(
                    "admin.service.plans.pricing.bulk-destroy",
                    [servicePlan.service_type_id, servicePlan.id]
                ),
                {
                    ids: selectedItems,
                },
                {
                    onSuccess: () => {
                        setSelectedItems([]);
                        setIsProcessing(false);
                    },
                    onError: () => {
                        setIsProcessing(false);
                    },
                }
            );
        }
    };

    // アクティブ切り替え
    const toggleActive = (pricing) => {
        router.post(
            route("admin.service.plans.pricing.toggle-active", [
                servicePlan.service_type_id,
                servicePlan.id,
                pricing.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // デフォルト設定
    const setDefault = (pricing) => {
        router.post(
            route("admin.service.plans.pricing.set-default", [
                servicePlan.service_type_id,
                servicePlan.id,
                pricing.id,
            ]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout>
            <Head title={`価格設定管理 - ${servicePlan.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title="価格設定管理"
                        description={`プラン: ${servicePlan.name} (${servicePlan.service_type?.name})`}
                        actions={[
                            {
                                label: "プラン一覧に戻る",
                                href: route(
                                    "admin.service.plans.index",
                                    servicePlan.service_type_id
                                ),
                                variant: "secondary",
                                icon: ArrowLeftIcon,
                            },
                            {
                                label: "価格設定を追加",
                                href: route(
                                    "admin.service.plans.pricing.create",
                                    [servicePlan.service_type_id, servicePlan.id]
                                ),
                                variant: "primary",
                                icon: PlusIcon,
                            },
                        ]}
                    />

                    <div className="mt-6 space-y-6">
                        {/* 統計情報 */}
                        <StatsCards stats={stats} />

                        {/* 検索・フィルター */}
                        <SearchFilters 
                            filters={filters}
                            handleSearch={handleSearch}
                            handleReset={handleReset}
                        />

                        {/* 一括操作 */}
                        <BulkActions 
                            selectedItems={selectedItems}
                            handleBulkDelete={handleBulkDelete}
                            isProcessing={isProcessing}
                        />

                        {/* 価格設定一覧 */}
                        <PricingTable 
                            planPricings={planPricings}
                            servicePlan={servicePlan}
                            selectedItems={selectedItems}
                            handleSelectAll={handleSelectAll}
                            handleSelectItem={handleSelectItem}
                            getTypeBadge={getTypeBadge}
                            getBillingTypeBadge={getBillingTypeBadge}
                            getStatusBadge={getStatusBadge}
                            toggleActive={toggleActive}
                            setDefault={setDefault}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}