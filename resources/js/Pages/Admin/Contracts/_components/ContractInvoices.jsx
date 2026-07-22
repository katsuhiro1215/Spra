import React from "react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/Badge";

const INVOICE_STATUS = {
    draft: { label: "下書き", variant: "secondary" },
    sent: { label: "送付済み", variant: "info" },
    viewed: { label: "確認済み", variant: "info" },
    paid: { label: "支払済み", variant: "success" },
    overdue: { label: "期限超過", variant: "danger" },
    cancelled: { label: "キャンセル", variant: "secondary" },
};

const PAYMENT_STATUS = {
    pending: { label: "確認待ち", variant: "warning" },
    completed: { label: "完了", variant: "success" },
    failed: { label: "失敗", variant: "danger" },
    refunded: { label: "返金済み", variant: "secondary" },
};

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

export default function ContractInvoices({ contract }) {
    const invoices = contract.invoices || [];
    const contractTotal = contract.current_version?.total_amount || 0;

    const totalPaid = invoices.reduce((sum, invoice) => {
        const invoicePaid = (invoice.payments || [])
            .filter((p) => p.status === "completed")
            .reduce((s, p) => s + parseFloat(p.amount), 0);
        return sum + invoicePaid;
    }, 0);

    const totalPending = invoices.reduce((sum, invoice) => {
        const invoicePending = (invoice.payments || [])
            .filter((p) => p.status === "pending")
            .reduce((s, p) => s + parseFloat(p.amount), 0);
        return sum + invoicePending;
    }, 0);

    const remaining = contractTotal - totalPaid;
    const progress =
        contractTotal > 0 ? (totalPaid / contractTotal) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* 契約全体の入金状況 */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-300">
                        入金済み
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatAmount(totalPaid)} / {formatAmount(contractTotal)}
                    </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${progress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm mt-2 flex-wrap gap-2">
                    <span className="text-slate-500 dark:text-slate-400">
                        進捗: {progress.toFixed(1)}%
                    </span>
                    <div className="flex gap-4">
                        {totalPending > 0 && (
                            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                確認待ち: {formatAmount(totalPending)}
                            </span>
                        )}
                        {remaining > 0 && (
                            <span className="text-red-600 dark:text-red-400 font-semibold">
                                残金: {formatAmount(remaining)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 請求書一覧 */}
            {invoices.length > 0 ? (
                <div className="space-y-3">
                    {invoices.map((invoice) => {
                        const status =
                            INVOICE_STATUS[invoice.status] || {
                                label: invoice.status,
                                variant: "secondary",
                            };
                        const invoicePayments = invoice.payments || [];

                        return (
                            <Link
                                key={invoice.id}
                                href={route(
                                    "admin.invoice.show",
                                    invoice.id,
                                )}
                                className="block border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {invoice.invoice_number}
                                            </span>
                                            <Badge variant={status.variant}>
                                                {status.label}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            発行日:{" "}
                                            {formatDate(invoice.issue_date)}
                                            {invoice.due_date &&
                                                ` ・ 支払期限: ${formatDate(invoice.due_date)}`}
                                        </p>
                                        {invoicePayments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {invoicePayments.map((p) => {
                                                    const pStatus =
                                                        PAYMENT_STATUS[
                                                            p.status
                                                        ] || {
                                                            label: p.status,
                                                            variant:
                                                                "secondary",
                                                        };
                                                    return (
                                                        <span
                                                            key={p.id}
                                                            className="inline-flex items-center gap-1 text-xs"
                                                        >
                                                            <Badge
                                                                variant={
                                                                    pStatus.variant
                                                                }
                                                                size="xs"
                                                            >
                                                                入金{" "}
                                                                {formatAmount(
                                                                    p.amount,
                                                                )}{" "}
                                                                ・{" "}
                                                                {pStatus.label}
                                                            </Badge>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                        {formatAmount(invoice.total_amount)}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center py-12 text-slate-500 dark:text-slate-400">
                    この契約に関連する請求書はまだありません。
                </p>
            )}
        </div>
    );
}
