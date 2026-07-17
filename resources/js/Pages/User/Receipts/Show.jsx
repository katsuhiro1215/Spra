import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import {
    UserCard,
    UserCardHeader,
    UserCardTitle,
    UserCardBody,
} from "@/Components/User";
import { PrimaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

export default function Show({ receipt }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "領収書一覧", href: route("user.receipt.index") },
        { label: receipt.receipt_number, href: null },
    ];

    const handleDownload = () => {
        window.open(route("user.receipt.download", receipt.id), "_blank");
    };

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title={`領収書 ${receipt.receipt_number}`}
                    description={`発行日: ${formatDate(receipt.issued_at)}`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`領収書 ${receipt.receipt_number}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex justify-end">
                    <PrimaryButton onClick={handleDownload}>
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        PDFをダウンロード
                    </PrimaryButton>
                </div>

                <UserCard>
                    <UserCardHeader>
                        <UserCardTitle>領収書情報</UserCardTitle>
                    </UserCardHeader>
                    <UserCardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    領収書番号
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                    {receipt.receipt_number}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    発行日
                                </dt>
                                <dd className="mt-1 text-gray-900">
                                    {formatDate(receipt.issued_at)}
                                </dd>
                            </div>
                            {receipt.invoice && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">
                                        関連請求書
                                    </dt>
                                    <dd className="mt-1 text-gray-900">
                                        {receipt.invoice.invoice_number}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </UserCardBody>
                </UserCard>

                <UserCard>
                    <UserCardBody>
                        <div className="space-y-2 max-w-md ml-auto">
                            <div className="flex justify-between text-gray-700">
                                <span>金額（税抜き）</span>
                                <span>{formatAmount(receipt.amount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>消費税</span>
                                <span>{formatAmount(receipt.tax_amount)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-300 pt-3">
                                <span>合計</span>
                                <span>
                                    {formatAmount(receipt.total_amount)}
                                </span>
                            </div>
                        </div>
                    </UserCardBody>
                </UserCard>
            </div>
        </AuthenticatedLayout>
    );
}
