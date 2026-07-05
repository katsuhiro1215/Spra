import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    ReceiptPercentIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

export default function CompanyReceipts({ receipts = [], companyId }) {
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

    const handleDownload = (receiptId) => {
        router.get(
            route("admin.receipt.pdf", receiptId),
            {},
            {
                onSuccess: () => {
                    // PDFダウンロード成功
                },
            },
        );
    };

    const totalAmount = receipts.reduce(
        (sum, receipt) => sum + parseFloat(receipt.amount || 0),
        0,
    );

    return (
        <div className="space-y-6">
            {/* 合計領収額 */}
            <Card>
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                総領収額
                            </p>
                            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(totalAmount)}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <ReceiptPercentIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 領収書一覧 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                領収書一覧
                            </h2>
                            <Badge
                                text={`${receipts.length}件`}
                                variant="neutral"
                                size="sm"
                            />
                        </div>
                        <Link
                            href={route("admin.receipts.create", {
                                company_id: companyId,
                            })}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            領収書を作成
                        </Link>
                    </div>
                </CardHeader>
                <CardBody>
                    {receipts && receipts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            領収書番号
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
                                            関連請求書
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
                                    {receipts.map((receipt) => (
                                        <tr
                                            key={receipt.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {receipt.receipt_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                                {formatDate(receipt.issued_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {formatCurrency(receipt.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {receipt.invoice ? (
                                                    <Link
                                                        href={route(
                                                            "admin.invoice.show",
                                                            receipt.invoice.id,
                                                        )}
                                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                    >
                                                        {
                                                            receipt.invoice
                                                                .invoice_number
                                                        }
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {receipt.client_downloaded_at ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            ダウンロード済み
                                                        </div>
                                                        <div className="text-xs">
                                                            {formatDateTime(
                                                                receipt.client_downloaded_at,
                                                            )}
                                                        </div>
                                                        {receipt.client_downloaded_by && (
                                                            <div className="text-xs">
                                                                by{" "}
                                                                {
                                                                    receipt
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
                                                            receipt.id,
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
                                領収書がありません
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                この企業への領収書はまだ発行されていません。
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
