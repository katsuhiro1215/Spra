import React from "react";
import { Head, Link } from "@inertiajs/react";
import UserAuthLayout from "@/Layouts/UserAuthLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function InvoiceShow({ invoice }) {
    const statusColors = {
        draft: "gray",
        sent: "blue",
        viewed: "indigo",
        paid: "green",
        overdue: "red",
        cancelled: "gray",
    };

    const statusLabels = {
        draft: "下書き",
        sent: "送付済み",
        viewed: "確認済み",
        paid: "支払済み",
        overdue: "期限切れ",
        cancelled: "キャンセル",
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const handleMarkAsViewed = () => {
        // 確認済みにマークするロジック
        if (invoice.status === "sent") {
            // 後で実装予定
            console.log("Mark as viewed");
        }
    };

    const handleDownloadPDF = () => {
        // PDF ダウンロードロジック
        window.open(route("user.invoice.pdf", invoice.id), "_blank");
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "請求書一覧", href: route("user.invoice.index") },
        { label: invoice.invoice_number, href: null },
    ];

    return (
        <UserAuthLayout>
            <Head title={`請求書 ${invoice.invoice_number}`} />

            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8">
                <PageHeader
                    title={`請求書 ${invoice.invoice_number}`}
                    description={`発行日: ${new Date(invoice.issue_date).toLocaleDateString("ja-JP")}`}
                    breadcrumbs={breadcrumbs}
                />

                {/* ステータスとアクション */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                            {statusLabels[invoice.status]}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <SecondaryButton
                            onClick={handleDownloadPDF}
                            className="inline-flex items-center"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            PDF をダウンロード
                        </SecondaryButton>
                    </div>
                </div>

                {/* 請求書情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 基本情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>基本情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        請求書番号
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {invoice.invoice_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        発行日
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(
                                            invoice.issue_date,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        契約内容
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {invoice.contract?.title}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 支払い情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>支払い情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        請求期間
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(
                                            invoice.billing_period_start,
                                        ).toLocaleDateString("ja-JP")}{" "}
                                        〜{" "}
                                        {new Date(
                                            invoice.billing_period_end,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        お支払い期限
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {new Date(
                                            invoice.due_date,
                                        ).toLocaleDateString("ja-JP")}
                                    </p>
                                </div>
                                {invoice.sent_at && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            送付日時
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {new Date(
                                                invoice.sent_at,
                                            ).toLocaleString("ja-JP")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* 請求明細 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>請求明細</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {invoice.items && invoice.items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                説明
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-20">
                                                数量
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-32">
                                                単価
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white w-32">
                                                合計
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {item.description}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatAmount(item.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                明細はありません
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* 金額計算 */}
                <Card className="mb-6">
                    <CardBody>
                        <div className="space-y-2 max-w-md ml-auto">
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>小計:</span>
                                <span>{formatAmount(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount_amount > 0 && (
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>割引:</span>
                                    <span>
                                        -{formatAmount(invoice.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>消費税 ({invoice.tax_rate * 100}%):</span>
                                <span>{formatAmount(invoice.tax_amount)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-600 pt-3">
                                <span>合計:</span>
                                <span>
                                    {formatAmount(invoice.total_amount)}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 備考 */}
                {invoice.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>備考</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {invoice.notes}
                            </p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </UserAuthLayout>
    );
}
