import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

const PURPLE_TEXT = `
    bg-transparent text-purple-600
    hover:text-purple-900 hover:bg-purple-50
    focus:ring-purple-500
    dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20
`
    .trim()
    .replace(/\s+/g, " ");

const ORANGE_TEXT = `
    bg-transparent text-orange-600
    hover:text-orange-900 hover:bg-orange-50
    focus:ring-orange-500
    dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20
`
    .trim()
    .replace(/\s+/g, " ");

const EMERALD_TEXT = `
    bg-transparent text-emerald-600
    hover:text-emerald-900 hover:bg-emerald-50
    focus:ring-emerald-500
    dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20
`
    .trim()
    .replace(/\s+/g, " ");

const InvoicesTable = ({
    invoices,
    onDelete,
    onSend,
    onConfirmPayment,
    onResend,
}) => {
    // ステータスのバッジバリアントを取得
    const getInvoiceStatusVariant = (status) => {
        const variants = {
            draft: "secondary",
            sent: "info",
            viewed: "success",
            paid: "success",
            overdue: "danger",
            cancelled: "secondary",
        };
        return variants[status] || "secondary";
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
                                            variant={getInvoiceStatusVariant(
                                                invoice.status,
                                            )}
                                        >
                                            {getStatusLabel(invoice.status)}
                                        </Badge>
                                        {invoice.receipt && (
                                            <Badge variant="success" size="xs">
                                                📄 領収書発行済
                                            </Badge>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.invoice.show",
                                                invoice.id,
                                            )}
                                            title="詳細"
                                        />

                                        {invoice.status === "draft" && (
                                            <>
                                                <IconButton
                                                    variant="warning-text"
                                                    icon={PencilIcon}
                                                    size="lg"
                                                    href={route(
                                                        "admin.invoice.edit",
                                                        invoice.id,
                                                    )}
                                                    title="編集"
                                                />
                                                <IconButton
                                                    variant="success-text"
                                                    icon={PaperAirplaneIcon}
                                                    size="lg"
                                                    onClick={() =>
                                                        onSend(invoice)
                                                    }
                                                    title="送付"
                                                />
                                                <IconButton
                                                    variant="danger-text"
                                                    icon={TrashIcon}
                                                    size="lg"
                                                    onClick={() =>
                                                        onDelete(invoice)
                                                    }
                                                    title="削除"
                                                />
                                            </>
                                        )}

                                        {invoice.status !== "draft" && (
                                            <>
                                                <IconButton
                                                    colorClasses={
                                                        PURPLE_TEXT
                                                    }
                                                    icon={
                                                        DocumentArrowDownIcon
                                                    }
                                                    size="lg"
                                                    onClick={() =>
                                                        window.open(
                                                            route(
                                                                "admin.invoice.pdf.preview",
                                                                invoice.id,
                                                            ),
                                                            "_blank",
                                                        )
                                                    }
                                                    title="PDFを確認・ダウンロード"
                                                />

                                                {/* 送付済み/期限超過の請求書は再送可能 */}
                                                {(invoice.status === "sent" ||
                                                    invoice.status ===
                                                        "overdue") && (
                                                    <IconButton
                                                        colorClasses={
                                                            ORANGE_TEXT
                                                        }
                                                        icon={ArrowPathIcon}
                                                        size="lg"
                                                        onClick={() =>
                                                            onResend(invoice)
                                                        }
                                                        title="再送信"
                                                    />
                                                )}

                                                {/* 送付済み/期限超過で未払いの請求書は入金確認可能 */}
                                                {(invoice.status === "sent" ||
                                                    invoice.status ===
                                                        "overdue") &&
                                                    !invoice.receipt && (
                                                        <IconButton
                                                            colorClasses={
                                                                EMERALD_TEXT
                                                            }
                                                            icon={
                                                                CheckCircleIcon
                                                            }
                                                            size="lg"
                                                            onClick={() =>
                                                                onConfirmPayment(
                                                                    invoice,
                                                                )
                                                            }
                                                            title="入金確認"
                                                        />
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
