import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

const InvoicesTable = ({
    invoices,
    onDelete,
    onSend,
    onConfirmPayment,
    onResend,
}) => {
    // ステータスのバッジカラーを取得
    const getInvoiceStatusColor = (status) => {
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

    // ステータスのラベルを取得
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

    // 金額をフォーマット
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount);
    };

    // 日付をフォーマット
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // 期限超過チェック
    const isOverdue = (invoice) => {
        if (
            !invoice.due_date ||
            invoice.status === "paid" ||
            invoice.status === "cancelled"
        ) {
            return false;
        }
        return new Date(invoice.due_date) < new Date();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>請求書一覧 ({invoices.total}件)</CardTitle>
            </CardHeader>
            <CardBody>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>請求書番号</Th>
                            <Th>クライアント</Th>
                            <Th>請求金額</Th>
                            <Th>請求期間</Th>
                            <Th>支払期限</Th>
                            <Th>ステータス</Th>
                            <Th className="text-right">アクション</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {invoices.data.map((invoice) => (
                            <Tr key={invoice.id}>
                                <Td>
                                    <Link
                                        href={route(
                                            "admin.invoice.show",
                                            invoice.id,
                                        )}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                    >
                                        {invoice.invoice_number ||
                                            invoice.id.substring(0, 8)}
                                    </Link>
                                </Td>
                                <Td>
                                    <div className="text-gray-900 dark:text-white">
                                        {invoice.user?.profile?.full_name ||
                                            invoice.user?.email}
                                    </div>
                                    {invoice.company && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {invoice.company.name}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {formatAmount(invoice.total_amount)}
                                    </div>
                                    {invoice.discount_amount > 0 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            (値引:{" "}
                                            {formatAmount(
                                                invoice.discount_amount,
                                            )}
                                            )
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    {invoice.billing_period_start &&
                                    invoice.billing_period_end ? (
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            <div>
                                                {formatDate(
                                                    invoice.billing_period_start,
                                                )}
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                ～{" "}
                                                {formatDate(
                                                    invoice.billing_period_end,
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    {invoice.due_date ? (
                                        <span
                                            className={`${
                                                isOverdue(invoice)
                                                    ? "text-red-600 dark:text-red-400 font-semibold"
                                                    : "text-gray-900 dark:text-white"
                                            }`}
                                        >
                                            {formatDate(invoice.due_date)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <div className="flex flex-col gap-1">
                                        <Badge
                                            className={getInvoiceStatusColor(
                                                invoice.status,
                                            )}
                                        >
                                            {getStatusLabel(invoice.status)}
                                        </Badge>
                                        {invoice.receipt && (
                                            <Badge className="bg-green-100 text-green-800 text-xs">
                                                📄 領収書発行済
                                            </Badge>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <div className="flex justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.invoice.show",
                                                invoice.id,
                                            )}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>

                                        {invoice.status === "draft" && (
                                            <>
                                                <Link
                                                    href={route(
                                                        "admin.invoice.edit",
                                                        invoice.id,
                                                    )}
                                                    className="text-yellow-600 hover:text-yellow-800"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        onSend(invoice)
                                                    }
                                                    className="text-green-600 hover:text-green-800"
                                                    title="送付"
                                                >
                                                    <PaperAirplaneIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDelete(invoice)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                    title="削除"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}

                                        {invoice.status !== "draft" && (
                                            <>
                                                <a
                                                    href={route(
                                                        "admin.invoice.pdf",
                                                        invoice.id,
                                                    )}
                                                    className="text-purple-600 hover:text-purple-800"
                                                    title="PDF"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <DocumentArrowDownIcon className="h-5 w-5" />
                                                </a>

                                                {/* 送付済み/期限超過の請求書は再送可能 */}
                                                {(invoice.status === "sent" ||
                                                    invoice.status ===
                                                        "overdue") && (
                                                    <button
                                                        onClick={() =>
                                                            onResend(invoice)
                                                        }
                                                        className="text-orange-600 hover:text-orange-800"
                                                        title="再送信"
                                                    >
                                                        <ArrowPathIcon className="h-5 w-5" />
                                                    </button>
                                                )}

                                                {/* 送付済み/期限超過で未払いの請求書は入金確認可能 */}
                                                {(invoice.status === "sent" ||
                                                    invoice.status ===
                                                        "overdue") &&
                                                    !invoice.receipt && (
                                                        <button
                                                            onClick={() =>
                                                                onConfirmPayment(
                                                                    invoice,
                                                                )
                                                            }
                                                            className="text-emerald-600 hover:text-emerald-800"
                                                            title="入金確認"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default InvoicesTable;
