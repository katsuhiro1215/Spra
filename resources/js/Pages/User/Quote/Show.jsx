import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import {
    UserCard,
    UserCardHeader,
    UserCardBody,
    UserCardTitle,
} from "@/Components/User";
import Badge from "@/Components/Badge";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import {
    DocumentTextIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Show({ quote }) {
    const [showDetails, setShowDetails] = useState(true);
    // 金額・明細は currentVersion 側に保持されている
    const currentVersion = quote.current_version;

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

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "見積書一覧", href: route("user.quote.index") },
        { label: quote.quote_number, href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title={`見積書 ${quote.quote_number}`}
                    description={quote.title}
                    breadcrumbs={breadcrumbs}
                    actions={[
                        {
                            label: "戻る",
                            variant: "default",
                            onClick: handleBack,
                        },
                        {
                            label: "PDFをダウンロード",
                            variant: "primary",
                            onClick: handleDownloadPdf,
                        },
                    ]}
                />
            }
        >
            <Head title={`見積書 - ${quote.quote_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* 基本情報 */}
                <UserCard>
                    <UserCardHeader>
                        <div className="flex justify-between items-center">
                            <UserCardTitle>見積書情報</UserCardTitle>
                            <Badge className={getStatusColor(quote.status)}>
                                {getStatusLabel(quote.status)}
                            </Badge>
                        </div>
                    </UserCardHeader>
                    <UserCardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    見積書番号
                                </dt>
                                <dd className="mt-1 text-lg font-mono font-semibold text-gray-900">
                                    {quote.quote_number}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    タイトル
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                    {quote.title}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    有効期限
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                    {formatDate(quote.expiry_date)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    送信日
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                    {formatDate(quote.sent_at)}
                                </dd>
                            </div>
                        </div>
                    </UserCardBody>
                </UserCard>

                {/* 説明 */}
                {quote.description && (
                    <UserCard>
                        <UserCardHeader>
                            <UserCardTitle>説明</UserCardTitle>
                        </UserCardHeader>
                        <UserCardBody>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {quote.description}
                            </p>
                        </UserCardBody>
                    </UserCard>
                )}

                {/* 見積明細 */}
                {currentVersion?.items && currentVersion.items.length > 0 && (
                    <UserCard>
                        <UserCardHeader>
                            <UserCardTitle>見積明細</UserCardTitle>
                        </UserCardHeader>
                        <UserCardBody>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                項目
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                                数量
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                                単価
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                                金額
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentVersion.items.map((item, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="px-4 py-3 text-gray-900">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatAmount(
                                                        item.unit_price,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
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
                                    <span className="font-medium text-gray-700">
                                        小計
                                    </span>
                                    <span className="font-semibold text-gray-900 w-24 text-right">
                                        {formatAmount(currentVersion.base_amount)}
                                    </span>
                                </div>
                                {currentVersion.discount_amount > 0 && (
                                    <div className="flex justify-end gap-12">
                                        <span className="font-medium text-gray-700">
                                            割引
                                        </span>
                                        <span className="font-semibold text-gray-900 w-24 text-right">
                                            -
                                            {formatAmount(
                                                currentVersion.discount_amount,
                                            )}
                                        </span>
                                    </div>
                                )}
                                {currentVersion.tax_rate > 0 && (
                                    <div className="flex justify-end gap-12">
                                        <span className="font-medium text-gray-700">
                                            税金 ({currentVersion.tax_rate}%)
                                        </span>
                                        <span className="font-semibold text-gray-900 w-24 text-right">
                                            {formatAmount(currentVersion.tax_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-2 flex justify-end gap-12">
                                    <span className="font-bold text-lg text-gray-900">
                                        合計
                                    </span>
                                    <span className="font-bold text-lg text-blue-600 w-24 text-right">
                                        {formatAmount(currentVersion.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </UserCardBody>
                    </UserCard>
                )}

                {/* 見積PDF表示 */}
                <UserCard>
                    <UserCardHeader>
                        <UserCardTitle>見積書PDF</UserCardTitle>
                    </UserCardHeader>
                    <UserCardBody>
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
                    </UserCardBody>
                </UserCard>

                {/* アクションボタン */}
                <UserCard>
                    <UserCardBody>
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
                    </UserCardBody>
                </UserCard>
            </div>
        </AuthenticatedLayout>
    );
}
