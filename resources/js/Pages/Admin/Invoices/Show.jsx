import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Badge } from "@/Components/Badges";
import { FlashMessage } from "@/Components/Notifications";
import { ConfirmAlert } from "@/Components/Alerts";
import {
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
    DocumentArrowDownIcon,
    CurrencyYenIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// Custom Components
import BasicInfo from "./_components/BasicInfo";
import ClientInfo from "./_components/ClientInfo";
import InvoiceDetails from "./_components/InvoiceDetails";
import PaymentInfo from "./_components/PaymentInfo";

export default function Show({ invoice, payments }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [showConfirmAlert, setShowConfirmAlert] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const tabs = [
        { id: "basic", label: "基本情報" },
        { id: "client", label: "クライアント" },
        { id: "details", label: "明細" },
        { id: "payment", label: "支払情報" },
    ];

    // ========================================
    // Handlers
    // ========================================
    const handleSendClick = () => {
        setConfirmAction("send");
        setShowConfirmAlert(true);
    };

    const handleDeleteClick = () => {
        setConfirmAction("delete");
        setShowConfirmAlert(true);
    };

    const handleConfirmAction = () => {
        if (confirmAction === "send") {
            router.patch(route("admin.invoice.send", invoice.id));
        } else if (confirmAction === "delete") {
            router.delete(route("admin.invoice.destroy", invoice.id), {
                onSuccess: () => {
                    router.visit(route("admin.invoice.index"));
                },
            });
        }
        setShowConfirmAlert(false);
        setConfirmAction(null);
    };

    // ========================================
    // Helpers
    // ========================================
    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            sent: "送付済み",
            viewed: "確認済み",
            paid: "支払済み",
            overdue: "期限超過",
            cancelled: "キャンセル",
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
            sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            viewed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
            overdue:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            cancelled:
                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        );
    };

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

    const isOverdue = () => {
        if (
            !invoice.due_date ||
            invoice.status === "paid" ||
            invoice.status === "cancelled"
        ) {
            return false;
        }
        return new Date(invoice.due_date) < new Date();
    };

    // ========================================
    // Confirm Alert Messages
    // ========================================
    const getConfirmMessage = () => {
        if (confirmAction === "send") {
            return {
                title: "請求書を送付します",
                message: `請求書「${invoice.invoice_number}」をクライアントに送付してもよろしいですか？`,
                confirmText: "送付する",
                type: "confirm",
            };
        } else if (confirmAction === "delete") {
            return {
                title: "請求書を削除します",
                message: `請求書「${invoice.invoice_number}」を削除してもよろしいですか？\nこの操作は取り消せません。`,
                confirmText: "削除する",
                type: "warning",
            };
        }
        return { title: "", message: "", confirmText: "実行", type: "confirm" };
    };

    // ========================================
    // Header & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.invoice.index"),
        },
        ...(invoice.status === "draft"
            ? [
                  {
                      label: "送付",
                      icon: PaperAirplaneIcon,
                      variant: "primary",
                      onClick: handleSendClick,
                  },
                  {
                      label: "編集",
                      icon: PencilIcon,
                      variant: "secondary",
                      route: route("admin.invoice.edit", invoice.id),
                  },
                  {
                      label: "削除",
                      icon: TrashIcon,
                      variant: "danger",
                      onClick: handleDeleteClick,
                  },
              ]
            : []),
        ...(["sent", "viewed", "overdue"].includes(invoice.status)
            ? [
                  {
                      label: "PDF",
                      icon: DocumentArrowDownIcon,
                      variant: "secondary",
                      href: route("admin.invoice.pdf", invoice.id),
                      target: "_blank",
                  },
              ]
            : []),
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "請求書一覧", href: route("admin.invoice.index") },
        { label: invoice.invoice_number || "請求書詳細", href: null },
    ];

    const confirmMessage = getConfirmMessage();

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`請求書: ${invoice.invoice_number || invoice.id.substring(0, 8)}`}
                    description={`${getStatusLabel(invoice.status)} • ${formatDate(invoice.issued_at || invoice.created_at)}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="請求書詳細" />
            <FlashMessage />

            {/* 確認ダイアログ */}
            <ConfirmAlert
                isOpen={showConfirmAlert}
                onClose={() => {
                    setShowConfirmAlert(false);
                    setConfirmAction(null);
                }}
                onConfirm={handleConfirmAction}
                title={confirmMessage.title}
                message={confirmMessage.message}
                confirmText={confirmMessage.confirmText}
                type={confirmMessage.type}
            />

            {/* 期限超過警告 */}
            {isOverdue() && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                支払期限を過ぎています
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* メインレイアウト - 2カラム */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左側パネル - タブ + 情報 */}
                <div className="lg:col-span-2">
                    {/* タブ */}
                    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <div className="flex space-x-8 min-w-max">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* タブコンテンツ */}
                    <div>
                        {activeTab === "basic" && (
                            <BasicInfo invoice={invoice} />
                        )}
                        {activeTab === "client" && (
                            <ClientInfo invoice={invoice} />
                        )}
                        {activeTab === "details" && (
                            <InvoiceDetails invoice={invoice} />
                        )}
                        {activeTab === "payment" && (
                            <PaymentInfo
                                invoice={invoice}
                                payments={payments}
                            />
                        )}
                    </div>
                </div>

                {/* 右側パネル - PDF プレビュー */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-lg shadow-sm overflow-hidden">
                        {/* 請求書PDF表示 */}
                        <div
                            style={{
                                height: "600px",
                                overflow: "auto",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                            }}
                            className="dark:border-gray-700 dark:bg-gray-900"
                        >
                            <iframe
                                src={route(
                                    "admin.invoice.pdf.preview",
                                    invoice.id,
                                )}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                                title="請求書PDF"
                            />
                        </div>

                        {/* 情報セクション */}
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                            {/* ステータス */}
                            <div>
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    ステータス
                                </p>
                                <div className="mt-2 inline-block">
                                    <Badge
                                        className={getStatusColor(
                                            invoice.status,
                                        )}
                                    >
                                        {getStatusLabel(invoice.status)}
                                    </Badge>
                                </div>
                            </div>

                            {/* 請求書番号 */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    請求書番号
                                </p>
                                <p className="mt-2 text-lg font-mono font-bold text-gray-900 dark:text-white">
                                    {invoice.invoice_number ||
                                        invoice.id.substring(0, 8)}
                                </p>
                            </div>

                            {/* 請求金額 */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    請求金額
                                </p>
                                <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatAmount(invoice.total_amount)}
                                </p>
                            </div>

                            {/* PDF ダウンロード */}
                            {invoice.status !== "draft" && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <a
                                        href={route(
                                            "admin.invoice.pdf",
                                            invoice.id,
                                        )}
                                        download
                                        className="w-full inline-block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        PDF をダウンロード
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
