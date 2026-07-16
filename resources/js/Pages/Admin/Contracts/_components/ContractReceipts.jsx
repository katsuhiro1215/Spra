import React from "react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/Badge";

const RECEIPT_STATUS = {
    draft: { label: "下書き", variant: "secondary" },
    issued: { label: "発行済み", variant: "info" },
    sent: { label: "送付済み", variant: "success" },
};

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

export default function ContractReceipts({ contract }) {
    const receipts = (contract.invoices || [])
        .filter((invoice) => invoice.receipt)
        .map((invoice) => ({ ...invoice.receipt, invoice }));

    if (receipts.length === 0) {
        return (
            <p className="text-center py-12 text-slate-500 dark:text-slate-400">
                この契約に関連する領収書はまだありません。入金が確認され請求書が支払済みになると自動的に発行されます。
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {receipts.map((receipt) => {
                const status =
                    RECEIPT_STATUS[receipt.status] || {
                        label: receipt.status,
                        variant: "secondary",
                    };

                return (
                    <Link
                        key={receipt.id}
                        href={route("admin.receipt.show", receipt.id)}
                        className="block border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {receipt.receipt_number}
                                    </span>
                                    <Badge variant={status.variant}>
                                        {status.label}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    請求書: {receipt.invoice.invoice_number}
                                    {receipt.issued_at &&
                                        ` ・ 発行日: ${formatDate(receipt.issued_at)}`}
                                    {receipt.sent_at &&
                                        ` ・ 送付日: ${formatDate(receipt.sent_at)}`}
                                </p>
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                {formatAmount(receipt.total_amount)}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
