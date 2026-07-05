import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

export default function CompanyInvoices({ invoices = [], totalPaid = 0 }) {
    const formatCurrency = (amount) => {
        if (!amount) return "¥0";
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: { text: "下書き", variant: "neutral" },
            sent: { text: "送信済み", variant: "info" },
            paid: { text: "支払済み", variant: "success" },
            overdue: { text: "延滞", variant: "danger" },
            cancelled: { text: "キャンセル", variant: "neutral" },
        };
        return badges[status] || { text: status, variant: "neutral" };
    };

    const handleDownload = (invoiceId) => {
        router.get(
            route("admin.invoice.pdf", invoiceId),
            {},
            {
                onSuccess: () => {
                    // PDFダウンロード成功
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* 合計支払額 */}
            <Card>
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                総支払額
                            </p>
                            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(totalPaid)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 請求書一覧 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                請求書一覧
                            </h2>
                            <Badge
                                text={`${invoices.length}件`}
                                variant="neutral"
                                size="sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {invoices && invoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            請求書番号
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            発行日
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            金額
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            ステータス
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            クライアント
                                            <br />
                                            ダウンロード
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {invoices.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "admin.invoice.show",
                                                        invoice.id,
                                                    )}
                                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                >
                                                    {invoice.invoice_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                                {formatDate(invoice.issue_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {formatCurrency(
                                                    invoice.total_amount,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    {...getStatusBadge(
                                                        invoice.status,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {invoice.client_downloaded_at ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            ダウンロード済み
                                                        </div>
                                                        <div className="text-xs">
                                                            {formatDateTime(
                                                                invoice.client_downloaded_at,
                                                            )}
                                                        </div>
                                                        {invoice.client_downloaded_by && (
                                                            <div className="text-xs">
                                                                by{" "}
                                                                {
                                                                    invoice
                                                                        .client_downloaded_by
                                                                        .name
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                        <ClockIcon className="h-4 w-4" />
                                                        未ダウンロード
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleDownload(
                                                            invoice.id,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                >
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                    ダウンロード
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                                請求書がありません
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                この企業への請求書はまだ発行されていません。
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
