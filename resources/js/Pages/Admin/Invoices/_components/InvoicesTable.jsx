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
} from "@heroicons/react/24/outline";

const InvoicesTable = ({ invoices, onDelete, onSend }) => {
    // ステータスのバッジカラーを取得
    const getInvoiceStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800",
            sent: "bg-blue-100 text-blue-800",
            viewed: "bg-green-100 text-green-800",
            paid: "bg-emerald-100 text-emerald-800",
            overdue: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
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
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {invoice.invoice_number ||
                                            invoice.id.substring(0, 8)}
                                    </Link>
                                </Td>
                                <Td>
                                    <div className="text-gray-900">
                                        {invoice.user?.profile?.full_name ||
                                            invoice.user?.email}
                                    </div>
                                    {invoice.company && (
                                        <div className="text-sm text-gray-500">
                                            {invoice.company.name}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="font-semibold text-gray-900">
                                        {formatAmount(invoice.total_amount)}
                                    </div>
                                    {invoice.discount_amount > 0 && (
                                        <div className="text-sm text-gray-500">
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
                                        <div className="text-sm">
                                            <div>
                                                {formatDate(
                                                    invoice.billing_period_start,
                                                )}
                                            </div>
                                            <div className="text-gray-500">
                                                ～{" "}
                                                {formatDate(
                                                    invoice.billing_period_end,
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </Td>
                                <Td>
                                    {invoice.due_date ? (
                                        <span
                                            className={
                                                isOverdue(invoice)
                                                    ? "text-red-600 font-semibold"
                                                    : ""
                                            }
                                        >
                                            {formatDate(invoice.due_date)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        className={getInvoiceStatusColor(
                                            invoice.status,
                                        )}
                                    >
                                        {getStatusLabel(invoice.status)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <div className="flex justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.invoice.show",
                                                invoice.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-800"
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
