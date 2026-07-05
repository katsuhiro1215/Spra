import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    DocumentTextIcon,
    EyeIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function CompanyQuotes({ quotes = [] }) {
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

    const getStatusBadge = (status) => {
        const badges = {
            draft: { text: "下書き", variant: "neutral" },
            sent: { text: "送信済み", variant: "info" },
            reviewed: { text: "確認済み", variant: "info" },
            approved: { text: "承認済み", variant: "success" },
            rejected: { text: "却下", variant: "danger" },
            expired: { text: "期限切れ", variant: "neutral" },
        };
        return badges[status] || { text: status, variant: "neutral" };
    };

    const totalAmount = quotes.reduce(
        (sum, quote) => sum + parseFloat(quote.total_amount || 0),
        0,
    );

    const approvedAmount = quotes
        .filter((q) => q.status === "approved")
        .reduce((sum, quote) => sum + parseFloat(quote.total_amount || 0), 0);

    return (
        <div className="space-y-6">
            {/* 見積もり統計 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    見積もり総額
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {formatCurrency(totalAmount)}
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                                <DocumentTextIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    承認済み見積もり額
                                </p>
                                <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(approvedAmount)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <DocumentTextIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* 見積もり一覧 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                見積もり一覧
                            </h2>
                            <Badge
                                text={`${quotes.length}件`}
                                variant="neutral"
                                size="sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {quotes && quotes.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            見積もり番号
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            件名
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            作成日
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            有効期限
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
                                            className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                        >
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {quotes.map((quote) => (
                                        <tr
                                            key={quote.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "admin.quote.show",
                                                        quote.id,
                                                    )}
                                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                >
                                                    {quote.quote_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                                                <div className="max-w-xs truncate">
                                                    {quote.subject || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                                {formatDate(quote.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                                                {formatDate(quote.valid_until)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {formatCurrency(
                                                    quote.total_amount,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    {...getStatusBadge(
                                                        quote.status,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.quote.show",
                                                            quote.id,
                                                        )}
                                                        className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                        詳細
                                                    </Link>
                                                </div>
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
                                見積もりがありません
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                この企業への見積もりはまだ作成されていません。
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
