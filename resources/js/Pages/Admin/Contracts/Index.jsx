import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import {
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTRACT_STATUS_OPTIONS,
    CONTRACT_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";
import ContractsTable from "./_components/ContractsTable";

export default function Index({ contracts, filters = {}, stats = {} }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(
        !!(filters?.status || filters?.type),
    );

    const { data, setData, get, processing } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
        type: filters?.type || "",
    });

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.contract.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({ search: "", status: "", type: "" });
        setShowFilters(false);
        get(route("admin.contract.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ========================================
    // Handlers - Actions
    // ========================================
    const handleDelete = (contract) => {
        const confirmed = confirm(
            `契約「${contract.title}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.contract.destroy", contract.id));
        }
    };

    const handleActivate = (contract) => {
        const confirmed = confirm(
            `契約「${contract.title}」を有効化してもよろしいですか？`,
        );
        if (confirmed) {
            router.patch(route("admin.contract.activate", contract.id));
        }
    };

    const handleCancel = (contract) => {
        const reason = prompt("キャンセル理由を入力してください（任意）:");
        if (reason !== null) {
            router.patch(route("admin.contract.cancel", contract.id), {
                cancellation_reason: reason,
            });
        }
    };

    const handleApprove = (contract) => {
        const confirmed = confirm(
            `契約「${contract.title}」を承認してもよろしいですか？`,
        );
        if (confirmed) {
            router.patch(route("admin.contract.approve", contract.id));
        }
    };

    const handleReminder = (contract) => {
        const confirmed = confirm(
            `${contract.user?.profile?.full_name || contract.user?.email}さんに署名リマインダーメールを送信しますか？`,
        );
        if (confirmed) {
            router.post(route("admin.contract.send-reminder", contract.id));
        }
    };

    // ========================================
    // Constants - Header Actions & Filters
    // ========================================
    const headerActions = [
        {
            label: "契約グループ",
            icon: RectangleGroupIcon,
            variant: "ghost",
            route: route("admin.contract-group.index"),
        },
        {
            label: PageConfig.contracts.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.contract.create"),
        },
    ];

    const hasActiveFilters = data.search || data.status || data.type;
    const activeFilterCount = [data.status, data.type].filter(
        Boolean,
    ).length;

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contracts.title}
                    description={PageConfig.contracts.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.contracts.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contracts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索 + フィルタートグル */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder={
                                PageConfig.contracts.ui.search.placeholder
                            }
                            disabled={processing}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <SecondaryButton
                            onClick={() => setShowFilters(!showFilters)}
                            size="md"
                            icon={FunnelIcon}
                            className="relative"
                            aria-expanded={showFilters}
                        >
                            {PageConfig.contracts.ui.filter.button}
                            {activeFilterCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </SecondaryButton>
                    </div>
                </div>

                {/* フィルターセクション */}
                {showFilters && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <FilterSelect
                                label="ステータス"
                                value={data.status}
                                onChange={(value) => setData("status", value)}
                                options={CONTRACT_STATUS_OPTIONS}
                            />
                            <FilterSelect
                                label="契約タイプ"
                                value={data.type}
                                onChange={(value) => setData("type", value)}
                                options={CONTRACT_TYPE_OPTIONS}
                            />
                            <div className="flex items-end">
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    size="md"
                                    icon={XMarkIcon}
                                    className="w-full"
                                >
                                    {PageConfig.contracts.ui.filter.clear}
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* 統計情報 */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    総件数
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.active || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    契約中
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {stats.pending || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    署名待ち
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.completed || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    完了
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {stats.suspended || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    一時停止
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                                    {stats.draft || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    下書き
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {stats?.total_amount !== undefined && (
                    <Card>
                        <div className="p-4 text-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
                                契約総額:
                            </span>
                            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {new Intl.NumberFormat("ja-JP", {
                                    style: "currency",
                                    currency: "JPY",
                                }).format(stats.total_amount)}
                            </span>
                        </div>
                    </Card>
                )}

                {/* テーブル */}
                <ContractsTable
                    contracts={contracts}
                    onDelete={handleDelete}
                    onActivate={handleActivate}
                    onCancel={handleCancel}
                    onApprove={handleApprove}
                    onReminder={handleReminder}
                />

                {/* ページネーション */}
                {contracts.data.length > 0 && (
                    <Pagination paginationData={contracts} />
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
