import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import Badge from "@/Components/Badge";
// Icons
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    PaperAirplaneIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Helpers
// import { formatCurrency, formatDate, formatDateTime } from "@/Helpers/format";

export default function Index({ receipts, filters, stats, statuses }) {
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

        router.get(route("admin.receipt.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        router.get(
            route("admin.receipt.index"),
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
    const handleDelete = (receipt) => {
        const confirmed = confirm(
            `領収書「${receipt.receipt_number}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.receipt.destroy", receipt.id));
        }
    };

    const handleSend = (receipt) => {
        const confirmed = confirm(
            `領収書「${receipt.receipt_number}」をメールで送付しますか？`,
        );
        if (confirmed) {
            router.post(route("admin.receipt.send", receipt.id));
        }
    };

    const handleDownload = (receipt) => {
        window.location.href = route("admin.receipt.download", receipt.id);
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.receipts.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.receipt.create"),
        },
    ];

    // ========================================
    // Status Badge Helper
    // ========================================
    const getStatusBadge = (status) => {
        const statusMap = {
            draft: { label: "下書き", variant: "gray" },
            issued: { label: "発行済み", variant: "blue" },
            sent: { label: "送付済み", variant: "green" },
        };
        const config = statusMap[status] || { label: status, variant: "gray" };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.receipts.title}
                    description={PageConfig.receipts.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.receipts.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.receipts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* フィルター */}
                <Card>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
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

                    {showFilters && (
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        検索
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="領収書番号で検索"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ステータス
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="">すべて</option>
                                        {Object.entries(statuses).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        onClick={handleSearch}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        クリア
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* 統計情報 */}
                {stats && (
                    <div className="grid grid-cols-5 gap-4 text-center">
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    総件数
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {stats.draft || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    下書き
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.issued || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    発行済み
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.sent || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    送付済み
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4 text-center">
                                <div className="text-xl font-bold text-emerald-600">
                                    {/* {formatCurrency(stats.total_amount || 0)} */}
                                </div>
                                <div className="text-sm text-gray-500">
                                    総領収金額
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* テーブル */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        領収書番号
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        宛先
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        請求書
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        金額
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        発行日
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        アクション
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {receipts.data && receipts.data.length > 0 ? (
                                    receipts.data.map((receipt) => (
                                        <tr
                                            key={receipt.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "admin.receipt.show",
                                                        receipt.id,
                                                    )}
                                                    className="text-emerald-600 hover:text-emerald-900 font-medium"
                                                >
                                                    {receipt.receipt_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {receipt.user?.name ||
                                                        receipt.user?.email}
                                                </div>
                                                {receipt.company && (
                                                    <div className="text-sm text-gray-500">
                                                        {receipt.company.name}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {receipt.invoice && (
                                                    <Link
                                                        href={route(
                                                            "admin.invoice.show",
                                                            receipt.invoice.id,
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                                    >
                                                        {
                                                            receipt.invoice
                                                                .invoice_number
                                                        }
                                                    </Link>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatCurrency(
                                                    receipt.total_amount,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(receipt.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {receipt.issued_at
                                                    ? formatDate(
                                                          receipt.issued_at,
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route(
                                                            "admin.receipt.show",
                                                            receipt.id,
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="詳細"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDownload(
                                                                receipt,
                                                            )
                                                        }
                                                        className="text-emerald-600 hover:text-emerald-900"
                                                        title="ダウンロード"
                                                    >
                                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                                    </button>
                                                    {receipt.status !==
                                                        "sent" && (
                                                        <>
                                                            <Link
                                                                href={route(
                                                                    "admin.receipt.edit",
                                                                    receipt.id,
                                                                )}
                                                                className="text-gray-600 hover:text-gray-900"
                                                                title="編集"
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        receipt,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                                title="削除"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {receipt.status ===
                                                        "issued" && (
                                                        <button
                                                            onClick={() =>
                                                                handleSend(
                                                                    receipt,
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="送付"
                                                        >
                                                            <PaperAirplaneIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            領収書が見つかりませんでした
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
                
                {/* ページネーション */}
                {receipts.data && receipts.data.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        <Pagination data={receipts} />
                    </div>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
