import React from "react";
import { Head, router, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Card from "@/Components/Card";
import Badge from "@/Components/Badge";
import { FlashMessage } from "@/Components/Notifications";
import {
    PencilIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount);
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const formatDateTime = (datetime) => {
    if (!datetime) return "-";
    return new Date(datetime).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function Show({ receipt }) {
    // ========================================
    // Handlers - Actions
    // ========================================
    const handleDelete = () => {
        if (
            confirm(
                `領収書「${receipt.receipt_number}」を削除してもよろしいですか？`,
            )
        ) {
            router.delete(route("admin.receipts.destroy", receipt.id), {
                onSuccess: () => {
                    router.visit(route("admin.receipts.index"));
                },
            });
        }
    };

    const handleSend = () => {
        if (
            confirm(
                `領収書「${receipt.receipt_number}」をメールで送付しますか？`,
            )
        ) {
            router.post(route("admin.receipts.send", receipt.id));
        }
    };

    const handleDownload = () => {
        window.location.href = route("admin.receipts.download", receipt.id);
    };

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

    // ========================================
    // Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "ダウンロード",
            icon: ArrowDownTrayIcon,
            variant: "secondary",
            onClick: handleDownload,
        },
    ];

    if (receipt.status !== "sent") {
        headerActions.push({
            label: "編集",
            icon: PencilIcon,
            variant: "secondary",
            route: route("admin.receipts.edit", receipt.id),
        });
        headerActions.push({
            label: "削除",
            icon: TrashIcon,
            variant: "danger",
            onClick: handleDelete,
        });
    }

    if (receipt.status === "issued") {
        headerActions.push({
            label: "送付",
            icon: PaperAirplaneIcon,
            variant: "primary",
            onClick: handleSend,
        });
    }

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "領収書一覧", href: route("admin.receipts.index") },
        { label: receipt.receipt_number, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`領収書: ${receipt.receipt_number}`}
                    description="領収書の詳細情報"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`領収書: ${receipt.receipt_number}`} />

            <FlashMessage />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* メインコンテンツ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 基本情報 */}
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                基本情報
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        領収書番号
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        {receipt.receipt_number}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        ステータス
                                    </label>
                                    <div className="mt-1">
                                        {getStatusBadge(receipt.status)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        発行日
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {receipt.issued_at
                                            ? formatDate(receipt.issued_at)
                                            : "-"}
                                    </p>
                                </div>
                                {receipt.sent_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            送付日時
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDateTime(receipt.sent_at)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {receipt.invoice && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        関連請求書
                                    </label>
                                    <Link
                                        href={route(
                                            "admin.invoice.show",
                                            receipt.invoice.id,
                                        )}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                        {receipt.invoice.invoice_number}
                                    </Link>
                                </div>
                            )}

                            {receipt.payment && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        関連決済
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        決済ID: {receipt.payment.id}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 金額情報 */}
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                金額情報
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="bg-emerald-50 rounded-lg p-6 text-center">
                                <p className="text-sm text-emerald-600 mb-2">
                                    領収金額
                                </p>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {formatCurrency(receipt.total_amount)}
                                </p>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">小計</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(receipt.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        消費税
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(receipt.tax_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-semibold border-t pt-2">
                                    <span className="text-gray-900">合計</span>
                                    <span className="text-gray-900">
                                        {formatCurrency(receipt.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* クライアントダウンロード情報 */}
                    {receipt.client_downloaded_at && (
                        <Card>
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    ダウンロード履歴
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-500">
                                        クライアントがダウンロード:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatDateTime(
                                            receipt.client_downloaded_at,
                                        )}
                                    </span>
                                    {receipt.client_downloaded_by && (
                                        <span className="text-gray-500">
                                            (
                                            {receipt.client_downloaded_by
                                                .name ||
                                                receipt.client_downloaded_by
                                                    .email}
                                            )
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* 備考 */}
                    {receipt.notes && (
                        <Card>
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    備考
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {receipt.notes}
                                </p>
                            </div>
                        </Card>
                    )}
                </div>

                {/* サイドバー */}
                <div className="space-y-6">
                    {/* 宛先情報 */}
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                宛先情報
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            {receipt.user && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        ユーザー
                                    </label>
                                    <Link
                                        href={route(
                                            "admin.user.show",
                                            receipt.user.id,
                                        )}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                        {receipt.user.name ||
                                            receipt.user.email}
                                    </Link>
                                    {receipt.user.email && (
                                        <p className="text-xs text-gray-500">
                                            {receipt.user.email}
                                        </p>
                                    )}
                                </div>
                            )}

                            {receipt.company && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        会社
                                    </label>
                                    <Link
                                        href={route(
                                            "admin.company.show",
                                            receipt.company.id,
                                        )}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                        {receipt.company.name}
                                    </Link>
                                    {receipt.company.addresses &&
                                        receipt.company.addresses.length >
                                            0 && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <p>
                                                    〒
                                                    {
                                                        receipt.company
                                                            .addresses[0]
                                                            .postal_code
                                                    }
                                                </p>
                                                <p>
                                                    {
                                                        receipt.company
                                                            .addresses[0]
                                                            .prefecture
                                                    }
                                                    {
                                                        receipt.company
                                                            .addresses[0].city
                                                    }
                                                    {
                                                        receipt.company
                                                            .addresses[0]
                                                            .address1
                                                    }
                                                </p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 作成者情報 */}
                    {receipt.created_by && (
                        <Card>
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    作成者情報
                                </h3>
                            </div>
                            <div className="px-6 py-4 space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        作成者
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {receipt.created_by.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        作成日時
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {formatDateTime(receipt.created_at)}
                                    </p>
                                </div>
                                {receipt.updated_at !== receipt.created_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">
                                            更新日時
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDateTime(receipt.updated_at)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
