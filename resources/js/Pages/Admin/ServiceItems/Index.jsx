import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { CreateButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert } from "@/Components/Alerts";
import TabNavigation from "@/Components/TabNavigation";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import {
    SERVICE_STATUS_OPTIONS,
} from "@/Constants/SelectOptions";
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
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    const [data, setData] = useState(
        initialFilters || {
            search: "",
            status: "",
            service_id: "",
            service_plan_id: "",
            item_type: "",
        },
    );

    // ========================================
    // Effects
    // ========================================
    // propsが更新されたらstateも更新
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (
            data.status ||
            data.service_id ||
            data.service_plan_id ||
            data.item_type
        ) {
            setShowFilters(true);
        }
    }, [data.status, data.service_id, data.service_plan_id, data.item_type]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== initialFilters.status ||
                data.service_id !== initialFilters.service_id ||
                data.service_plan_id !== initialFilters.service_plan_id ||
                data.item_type !== initialFilters.item_type
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.service_id, data.service_plan_id, data.item_type]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.service.item.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            service_id: "",
            service_plan_id: "",
            item_type: "",
            status: "",
        });
        setShowFilters(false);
        get(route("admin.service.item.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters =
        data.search ||
        data.status ||
        data.service_id ||
        data.service_plan_id ||
        data.item_type;

    const activeFilterCount = [
        data.status,
        data.service_id,
        data.service_plan_id,
        data.item_type,
    ].filter(Boolean).length;

    // ========================================
    // Handlers - Delete
    // ========================================
    const handleDelete = (service) => {
        setDeleteTarget(service);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setIsDeleting(deleteTarget.id);
            router.delete(
                route("admin.service.item.destroy", deleteTarget.id),
                {
                    onFinish: () => {
                        setIsDeleting(null);
                        setDeleteTarget(null);
                    },
                },
            );
        }
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.serviceItems.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.item.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.serviceItems.pages.index.title}
                    description={
                        PageConfig.serviceItems.pages.index.description
                    }
                    actions={headerActions}
                    breadcrumbs={PageConfig.serviceItems.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.serviceItems.pages.index.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* 削除アラート */}
            <DeleteAlert
                show={!!deleteTarget}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.name}
            />

            <div className="w-full flex flex-col gap-4">
                <Card>
                    <div className="p-4 space-y-4">
                        {/* 検索とフィルター */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            <div className="flex-shrink-0">{/* タブ */}</div>
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) =>
                                        setData("search", value)
                                    }
                                    onSearch={handleSearch}
                                    placeholder={
                                        PageConfig.admins.ui.search.placeholder
                                    }
                                    disabled={processing}
                                />
                            </div>
                            {/* フィルタートグルボタン */}
                            <div className="flex-shrink-0">
                                <SecondaryButton
                                    onClick={() => setShowFilters(!showFilters)}
                                    size="sm"
                                    className="relative"
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    {PageConfig.services.ui.filter.button}
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>

                    {/* フィルターセクション（折りたたみ可能）*/}
                    {showFilters && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* アイテムフィルター */}
                                <FilterSelect
                                    label={
                                        PageConfig.serviceItems.filters.service
                                            .label
                                    }
                                    value={data.service_id}
                                    onChange={(value) =>
                                        setData("service_id", value)
                                    }
                                    options={services.map((service) => ({
                                        value: service.id,
                                        label: service.name,
                                    }))}
                                    placeholder={
                                        PageConfig.serviceItems.filters.service
                                            .placeholder
                                    }
                                />
                                {/* プランフィルター */}
                                <FilterSelect
                                    label={
                                        PageConfig.serviceItems.filters.plan
                                            .label
                                    }
                                    value={data.service_plan_id}
                                    onChange={(value) =>
                                        setData("service_plan_id", value)
                                    }
                                    options={servicePlans.map((plan) => ({
                                        value: plan.id,
                                        label: plan.name,
                                    }))}
                                    placeholder={
                                        PageConfig.serviceItems.filters.plan
                                            .placeholder
                                    }
                                />
                                {/* アイテムタイプフィルター */}
                                <FilterSelect
                                    label={
                                        PageConfig.serviceItems.filters.type
                                            .label
                                    }
                                    value={data.item_type}
                                    onChange={(value) =>
                                        setData("item_type", value)
                                    }
                                    options={itemTypes.map((type) => ({
                                        value: type.value,
                                        label: type.label,
                                    }))}
                                    placeholder={
                                        PageConfig.serviceItems.filters.type
                                            .placeholder
                                    }
                                />
                                {/* ステータスフィルター */}
                                <FilterSelect
                                    label={
                                        PageConfig.serviceItems.filters.status
                                            .label
                                    }
                                    value={data.status}
                                    onChange={(value) =>
                                        setData("status", value)
                                    }
                                    options={SERVICE_STATUS_OPTIONS}
                                    placeholder={
                                        PageConfig.serviceItems.filters.status
                                            .placeholder
                                    }
                                />
                                {/* フィルタークリアボタン */}
                                <div className="flex items-end">
                                    <SecondaryButton
                                        onClick={handleClearFilters}
                                        disabled={!hasActiveFilters}
                                        size="md"
                                        className="w-full"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        {PageConfig.admins.ui.filter.clear}
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
                {/* テーブル */}
                <ServiceItemsTable
                    serviceItems={serviceItems.data}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
                {/* ページネーション */}
                {serviceItems.data.length > 0 && (
                    <Pagination paginationData={serviceItems} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
