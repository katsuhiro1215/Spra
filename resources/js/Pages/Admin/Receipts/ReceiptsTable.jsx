import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const ReceiptsTable = ({ receipts, onDelete }) => {
    const getReceiptStatusBadge = (status) => {
        const statusMap = {
            draft: { text: "下書き", variant: "info" },
            issued: { text: "発行済み", variant: "warning" },
            sent: { text: "送付済み", variant: "success" },
            closed: { text: "クローズ", variant: "secondary" },
        };
        return statusMap[status] || { text: status, variant: "default" };
    };

    return (
        <Card>
            <CardHeader>領収書一覧 ({receipts.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>領収書番号</Th>
                        <Th>宛先</Th>
                        <Th>請求書</Th>
                        <Th>金額</Th>
                        <Th>ステータス</Th>
                        <Th>発行日</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {receipts.data.map((receipt) => (
                        <Tr key={receipt.id}>
                            <Td>
                                <Link
                                    href={route(
                                        "admin.receipt.show",
                                        receipt.id,
                                    )}
                                    className="text-emerald-600 hover:text-emerald-900 font-medium"
                                >
                                    {receipt.receipt_number}
                                </Link>
                            </Td>
                            <Td>
                                <div className="text-sm text-gray-900">
                                    {receipt.user?.name || receipt.user?.email}
                                </div>
                                {receipt.company && (
                                    <div className="text-sm text-gray-500">
                                        {receipt.company.name}
                                    </div>
                                )}
                            </Td>
                            <Td>
                                {receipt.invoice && (
                                    <Link
                                        href={route(
                                            "admin.invoice.show",
                                            receipt.invoice.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-900 text-sm"
                                    >
                                        {receipt.invoice.invoice_number}
                                    </Link>
                                )}
                            </Td>
                            <Td>{formatCurrency(receipt.total_amount)}</Td>
                            <Td>{getReceiptStatusBadge(receipt.status)}</Td>
                            <Td>
                                {receipt.issued_at
                                    ? formatDate(receipt.issued_at)
                                    : "-"}
                            </Td>
                            <Td>
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={route(
                                            "admin.receipt.show",
                                            receipt.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="詳細"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDownload(receipt)}
                                        className="text-emerald-600 hover:text-emerald-900"
                                        title="ダウンロード"
                                    >
                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                    </button>
                                    {receipt.status !== "sent" && (
                                        <>
                                            <Link
                                                href={route(
                                                    "admin.receipt.edit",
                                                    receipt.id,
                                                )}
                                                className="text-gray-600 hover:text-gray-900"
                                                title="編集"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(receipt)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                                title="削除"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                    {receipt.status === "issued" && (
                                        <button
                                            onClick={() => handleSend(receipt)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="送付"
                                        >
                                            <PaperAirplaneIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
};

export default ReceiptsTable;
