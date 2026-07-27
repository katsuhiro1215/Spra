import React, { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Card from "@/Components/Card";
import Badge from "@/Components/Badge";
import { FlashMessage } from "@/Components/Notifications";
import { DeleteAlert, ConfirmAlert } from "@/Components/Alerts";
import SendingOverlay from "@/Components/Loading/SendingOverlay";
import {
    PencilIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

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
    // State - Alerts
    // ========================================
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showSendAlert, setShowSendAlert] = useState(false);
    const [sending, setSending] = useState(false);

    // ========================================
    // Handlers - Actions
    // ========================================
    const handleDelete = () => setShowDeleteAlert(true);

    const confirmDelete = () => {
        router.delete(route("admin.receipt.destroy", receipt.id), {
            onSuccess: () => {
                router.visit(route("admin.receipt.index"));
            },
        });
    };

    const handleSend = () => setShowSendAlert(true);

    const confirmSend = () => {
        setSending(true);
        router.post(
            route("admin.receipts.send", receipt.id),
            {},
            { onFinish: () => setSending(false) },
        );
    };

    const handleDownload = () => {
        window.location.href = route("admin.receipts.download", receipt.id);
    };

    // ========================================
    // Status Badge Helper
    // ========================================
    const getStatusBadge = (status) => {
        const statusMap = {
            draft: { label: "下書き", variant: "secondary" },
            issued: { label: "発行済み", variant: "info" },
            sent: { label: "送付済み", variant: "success" },
        };
        const config = statusMap[status] || {
            label: status,
            variant: "secondary",
        };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    // ========================================
    // Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.contracts.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.receipt.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.receipts.breadcrumbs,
        receipt.receipt_number,
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
            <SendingOverlay show={sending} />

            <DeleteAlert
                show={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={confirmDelete}
                itemName={receipt.receipt_number}
            />

            <ConfirmAlert
                isOpen={showSendAlert}
                onClose={() => setShowSendAlert(false)}
                onConfirm={confirmSend}
                title="送付確認"
                message={`領収書「${receipt.receipt_number}」をメールで送付しますか？`}
                confirmText="送付する"
                type="confirm"
            />

            {/* ダウンロード、削除、送付ボタン */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        ダウンロード
                    </button>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {receipt.status !== "sent" && (
                        <button
                            onClick={handleSend}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                        >
                            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                            送付
                        </button>
                    )}
                    {receipt.status !== "sent" && (
                        <>
                            <Link
                                href={route("admin.receipt.edit", receipt.id)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                            >
                                <PencilIcon className="h-5 w-5 mr-2" />
                                編集
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                削除
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* メインコンテンツ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 基本情報 */}
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                基本情報
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        領収書番号
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {receipt.receipt_number}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        ステータス
                                    </label>
                                    <div className="mt-1">
                                        {getStatusBadge(receipt.status)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        発行日
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {receipt.issued_at
                                            ? formatDate(receipt.issued_at)
                                            : "-"}
                                    </p>
                                </div>
                                {receipt.sent_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            送付日時
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {formatDateTime(receipt.sent_at)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {receipt.invoice && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        関連請求書
                                    </label>
                                    <Link
                                        href={route(
                                            "admin.invoice.show",
                                            receipt.invoice.id,
                                        )}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        {receipt.invoice.invoice_number}
                                    </Link>
                                </div>
                            )}

                            {receipt.payment && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        関連決済
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        決済ID: {receipt.payment.id}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 金額情報 */}
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                金額情報
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 text-center">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                                    領収金額
                                </p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(receipt.total_amount)}
                                </p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        小計
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatCurrency(receipt.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        消費税
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatCurrency(receipt.tax_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <span className="text-gray-900 dark:text-gray-100">
                                        合計
                                    </span>
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {formatCurrency(receipt.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* クライアントダウンロード情報 */}
                    {receipt.client_downloaded_at && (
                        <Card>
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    ダウンロード履歴
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        クライアントがダウンロード:
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatDateTime(
                                            receipt.client_downloaded_at,
                                        )}
                                    </span>
                                    {receipt.client_downloaded_by && (
                                        <span className="text-gray-500 dark:text-gray-400">
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
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    備考
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
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
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                宛先情報
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            {receipt.user && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        ユーザー
                                    </label>
                                    <Link
                                        href={route(
                                            "admin.user.show",
                                            receipt.user.id,
                                        )}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        {receipt.user.name ||
                                            receipt.user.email}
                                    </Link>
                                    {receipt.user.email && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {receipt.user.email}
                                        </p>
                                    )}
                                </div>
                            )}

                            {receipt.company && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        会社
                                    </label>
                                    <Link
                                        href={route(
                                            "admin.company.show",
                                            receipt.company.id,
                                        )}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        {receipt.company.name}
                                    </Link>
                                    {receipt.company.addresses &&
                                        receipt.company.addresses.length >
                                            0 && (
                                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
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
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    作成者情報
                                </h3>
                            </div>
                            <div className="px-6 py-4 space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        作成者
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {receipt.created_by.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        作成日時
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {formatDateTime(receipt.created_at)}
                                    </p>
                                </div>
                                {receipt.updated_at !== receipt.created_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            更新日時
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
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
