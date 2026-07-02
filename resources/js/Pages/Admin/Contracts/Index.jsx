import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTRACT_STATUS_OPTIONS,
    CONTRACT_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";
// Contract Components
import ContractsTable from "./_components/ContractsTable";

export default function Index({ contracts, filters, stats }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [typeFilter, setTypeFilter] = useState(filters?.type || "");

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (typeFilter) params.type = typeFilter;

        router.get(route("admin.contract.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setTypeFilter("");
        router.get(
            route("admin.contract.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
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
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.contract.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約管理"
                    description="契約情報を管理します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約管理" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* ヘッダー */}
            <div className="w-full flex flex-col gap-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                フィルター
                            </button>
                        </div>
                    </div>
                </div>

                {/* 統計情報 */}
                {stats && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    総件数
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.active || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    契約中
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {stats.pending || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    署名待ち
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.completed || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    完了
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {stats.draft || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    下書き
                                </div>
                            </div>
                        </div>
                        {stats.total_amount !== undefined && (
                            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                    契約総額:{" "}
                                    {new Intl.NumberFormat("ja-JP", {
                                        style: "currency",
                                        currency: "JPY",
                                    }).format(stats.total_amount)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* フィルター */}
                {showFilters && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    検索
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="契約番号、タイトル、クライアント名で検索"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ステータス
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">すべて</option>
                                    {CONTRACT_STATUS_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    契約タイプ
                                </label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">すべて</option>
                                    {CONTRACT_TYPE_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    検索
                                </button>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    クリア
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <Pagination paginationData={contracts} />
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
