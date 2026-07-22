import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { IS_FEATURED_OPTIONS } from "@/Constants/SelectOptions";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import ServicePlansTable from "./_components/ServicePlansTable";

export default function Index({
    servicePlans,
    statuses,
    billingCycles,
    services,
    filters: initialFilters,
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    const { data, setData, get, processing } = useForm({
        search: initialFilters?.search || "",
        status: initialFilters?.status || "",
        service_id: initialFilters?.service_id || "",
        is_featured: initialFilters?.is_featured || "",
    });

    // 検索実行
    const handleSearch = () => {
        get(route("admin.service.plan.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== (initialFilters?.status || "") ||
                data.service_id !== (initialFilters?.service_id || "") ||
                data.is_featured !== (initialFilters?.is_featured || "")
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.service_id, data.is_featured]);

    const handleClearFilters = () => {
        setData({ search: "", status: "", service_id: "", is_featured: "" });
        setShowFilters(false);
        get(route("admin.service.plan.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

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

    const serviceOptions = (services || []).map((service) => ({
        value: service.id,
        label: service.name,
    }));

    const statusOptions = (statuses || []).map((status) => ({
        value: status.value,
        label: status.label,
    }));

    const hasActiveFilters =
        data.search || data.status || data.service_id || data.is_featured;

    const activeFilterCount = [
        data.status,
        data.service_id,
        data.is_featured,
    ].filter(Boolean).length;

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
                {/* 検索・フィルター */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="プラン名・説明で検索"
                            disabled={processing}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <SecondaryButton
                            onClick={() => setShowFilters(!showFilters)}
                            size="md"
                            className="relative"
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            フィルター
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </SecondaryButton>
                    </div>
                </div>

                {showFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="サービス"
                                value={data.service_id}
                                onChange={(value) =>
                                    setData("service_id", value)
                                }
                                options={serviceOptions}
                                placeholder="すべてのサービス"
                            />
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) =>
                                    setData("status", value)
                                }
                                options={statusOptions}
                                placeholder="すべてのステータス"
                            />
                            <FilterSelect
                                label="注目"
                                value={data.is_featured}
                                onChange={(value) =>
                                    setData("is_featured", value)
                                }
                                options={IS_FEATURED_OPTIONS}
                                placeholder="すべて"
                            />
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    className="w-full"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    クリア
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

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
