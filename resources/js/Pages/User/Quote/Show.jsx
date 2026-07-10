import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody, CardTitle } from "@/Components/Card";
import Badge from "@/Components/Badge";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import {
    ArrowLeftIcon,
    DocumentTextIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Show({ quote }) {
    const [showDetails, setShowDetails] = useState(true);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            negotiating: "交渉中",
            approved: "承認済み",
            rejected: "却下",
            contracted: "契約済み",
            cancelled: "キャンセル",
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800",
            negotiating: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            contracted: "bg-blue-100 text-blue-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const handleDownloadPdf = () => {
        window.open(route("user.quote.pdf", quote.id), "_blank");
    };

    const handleAccept = () => {
        if (confirm("この見積書を承認してもよろしいですか？")) {
            router.post(route("user.quote.accept", quote.id));
        }
    };

    const handleReject = () => {
        if (confirm("この見積書を却下してもよろしいですか？")) {
            router.post(route("user.quote.reject", quote.id));
        }
    };

    const handleBack = () => {
        router.visit(route("user.quote.index"));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`見積書 - ${quote.quote_number}`} />
            <FlashMessage />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>戻る</span>
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 hover:border-blue-900 rounded transition-colors"
                    >
                        <DocumentTextIcon className="h-5 w-5" />
                        PDFをダウンロード
                    </button>
                </div>

                {/* 基本情報 */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>見積書情報</CardTitle>
                            <Badge className={getStatusColor(quote.status)}>
                                {getStatusLabel(quote.status)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    見積書番号
                                </dt>
                                <dd className="mt-1 text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                                    {quote.quote_number}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    タイトル
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {quote.title}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    有効期限
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {formatDate(quote.expiry_date)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    送信日
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {formatDate(quote.sent_at)}
                                </dd>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 説明 */}
                {quote.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>説明</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {quote.description}
                            </p>
                        </CardBody>
                    </Card>
                )}

                {/* 見積明細 */}
                {quote.items && quote.items.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>見積明細</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                                項目
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                                                数量
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                                                単価
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                                                金額
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quote.items.map((item, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-100 dark:border-gray-700"
                                            >
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatAmount(
                                                        item.quantity *
                                                            item.unit_price,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 合計 */}
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-end gap-12">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        小計
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 w-24 text-right">
                                        {formatAmount(quote.subtotal_amount)}
                                    </span>
                                </div>
                                {quote.discount_amount > 0 && (
                                    <div className="flex justify-end gap-12">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            割引
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 w-24 text-right">
                                            -
                                            {formatAmount(
                                                quote.discount_amount,
                                            )}
                                        </span>
                                    </div>
                                )}
                                {quote.tax_rate > 0 && (
                                    <div className="flex justify-end gap-12">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            税金 ({quote.tax_rate}%)
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 w-24 text-right">
                                            {formatAmount(quote.tax_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-end gap-12">
                                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                        合計
                                    </span>
                                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400 w-24 text-right">
                                        {formatAmount(quote.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* 見積PDF表示 */}
                <Card>
                    <CardHeader>
                        <CardTitle>見積書PDF</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div
                            style={{
                                height: "600px",
                                overflow: "auto",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "8px",
                            }}
                        >
                            <iframe
                                src={route("user.quote.pdf", quote.id)}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                                title="見積書PDF"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* アクションボタン */}
                <Card>
                    <CardBody>
                        <div className="flex gap-3 flex-wrap">
                            {(quote.status === "draft" ||
                                quote.status === "negotiating") && (
                                <>
                                    <PrimaryButton
                                        onClick={handleAccept}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckIcon className="h-5 w-5" />
                                        承認する
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={handleReject}
                                        className="flex items-center gap-2"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                        却下する
                                    </SecondaryButton>
                                </>
                            )}
                            <SecondaryButton onClick={handleBack}>
                                戻る
                            </SecondaryButton>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
