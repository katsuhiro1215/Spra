import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
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
import { INVOICE_STATUS_OPTIONS } from "@/Constants/SelectOptions";
// Invoice Components
import InvoicesTable from "./_components/InvoicesTable";

export default function Index({ invoices, filters, stats }) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;

        router.get(route("admin.invoice.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        router.get(
            route("admin.invoice.index"),
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
    const handleDelete = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.invoice.destroy", invoice.id));
        }
    };

    const handleSend = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」をクライアントに送付してもよろしいですか？`,
        );
        if (confirmed) {
            router.patch(route("admin.invoice.send", invoice.id));
        }
    };

    const handleConfirmPayment = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」の入金を確認し、領収書を発行・送付しますか？`,
        );
        if (confirmed) {
            router.post(route("admin.invoice.confirm-payment", invoice.id));
        }
    };

    const handleResend = (invoice) => {
        const confirmed = confirm(
            `請求書「${invoice.invoice_number}」を再送信しますか？`,
        );
        if (confirmed) {
            router.post(route("admin.invoice.resend", invoice.id));
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
            route: route("admin.invoice.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "請求書一覧", href: null },
    ];

    // 金額フォーマット
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="請求書管理"
                    description="請求書情報を管理します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書管理" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            {/* ヘッダー */}
            <div className="w-full flex flex-col gap-4">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                フィルター
                            </button>
                        </div>
                    </div>
                </div>

                {/* 統計情報 */}
                {stats && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    総件数
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.sent || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    送付済み
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {stats.paid || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    支払済み
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {stats.overdue || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    期限超過
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                                    {stats.draft || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    下書き
                                </div>
                            </div>
                        </div>
                        {stats.total_amount !== undefined && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-700">
                                            未収金額:{" "}
                                            {formatAmount(stats.total_amount)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-emerald-600">
                                            入金済み:{" "}
                                            {formatAmount(stats.paid_amount)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* フィルター */}
                {showFilters && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-3 gap-4">
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
                                        placeholder="請求書番号、クライアント名で検索"
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
                                    {INVOICE_STATUS_OPTIONS.map((option) => (
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
            <InvoicesTable
                invoices={invoices}
                onDelete={handleDelete}
                onSend={handleSend}
                onConfirmPayment={handleConfirmPayment}
                onResend={handleResend}
            />

            {/* ページネーション */}
            {invoices.data.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <Pagination paginationData={invoices} />
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
