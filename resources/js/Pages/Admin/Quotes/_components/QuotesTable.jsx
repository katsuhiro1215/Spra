import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { ShowButton, EditButton, DeleteButton } from "@/Components/Buttons";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { getStatusBadge } from "@/Constants/Badges";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const QuotesTable = ({ quotes, onDelete }) => {
    // ステータスのバッジカラーを取得
    const getQuoteStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800",
            sent: "bg-blue-100 text-blue-800",
            reviewed: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            expired: "bg-gray-400 text-gray-700",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    // ステータスのラベルを取得
    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            sent: "送信済み",
            reviewed: "確認済み",
            approved: "承認済み",
            rejected: "却下",
            expired: "期限切れ",
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>見積もり一覧 ({quotes.total}件)</CardTitle>
            </CardHeader>
            <CardBody>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>見積番号</Th>
                            <Th>タイトル</Th>
                            <Th>クライアント</Th>
                            <Th>金額</Th>
                            <Th>ステータス</Th>
                            <Th>有効期限</Th>
                            <Th>作成日</Th>
                            <Th className="text-right">アクション</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {quotes.data.map((quote) => (
                            <Tr key={quote.id}>
                                <Td>
                                    <Link
                                        href={route(
                                            "admin.quote.show",
                                            quote.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {quote.quote_number}
                                    </Link>
                                </Td>
                                <Td>
                                    <div className="font-medium text-gray-900">
                                        {quote.title}
                                    </div>
                                    {quote.requirements && (
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {quote.requirements}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="text-gray-900">
                                        {quote.client_name}
                                    </div>
                                    {quote.client_company && (
                                        <div className="text-sm text-gray-500">
                                            {quote.client_company}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        {quote.client_email}
                                    </div>
                                </Td>
                                <Td>
                                    <div className="font-semibold text-gray-900">
                                        {formatAmount(quote.total_amount)}
                                    </div>
                                    {quote.discount_amount > 0 && (
                                        <div className="text-sm text-green-600">
                                            割引:{" "}
                                            {formatAmount(
                                                quote.discount_amount,
                                            )}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        className={getQuoteStatusColor(
                                            quote.status,
                                        )}
                                    >
                                        {getStatusLabel(quote.status)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <div
                                        className={
                                            quote.expires_at &&
                                            new Date(quote.expires_at) <
                                                new Date()
                                                ? "text-red-600 font-medium"
                                                : ""
                                        }
                                    >
                                        {formatDate(quote.expires_at)}
                                    </div>
                                </Td>
                                <Td>{formatDate(quote.created_at)}</Td>
                                <Td>
                                    <div className="flex justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.quote.show",
                                                quote.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        {quote.status !== "approved" && (
                                            <Link
                                                href={route(
                                                    "admin.quote.edit",
                                                    quote.id,
                                                )}
                                                className="text-yellow-600 hover:text-yellow-800"
                                                title="編集"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>
                                        )}
                                        <Link
                                            href={route(
                                                "admin.quote.pdf",
                                                quote.id,
                                            )}
                                            className="text-green-600 hover:text-green-800"
                                            title="PDFダウンロード"
                                        >
                                            <DocumentArrowDownIcon className="h-5 w-5" />
                                        </Link>
                                        {quote.status !== "approved" && (
                                            <button
                                                onClick={() => onDelete(quote)}
                                                className="text-red-600 hover:text-red-800"
                                                title="削除"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
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

export default QuotesTable;
