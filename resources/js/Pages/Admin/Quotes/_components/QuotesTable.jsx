import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { IconButton } from "@/Components/Buttons";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const QuotesTable = ({ quotes, onDelete }) => {
    // ステータスのバッジバリアントを取得
    const getQuoteStatusVariant = (status) => {
        const variants = {
            draft: "secondary",
            negotiating: "info",
            approved: "success",
            rejected: "danger",
            contracted: "success",
            cancelled: "secondary",
        };
        return variants[status] || "secondary";
    };

    // ステータスのラベルを取得
    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            negotiating: "交渉中",
            approved: "承認済み",
            rejected: "却下",
            contracted: "契約済み",
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
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        {quote.quote_number}
                                    </Link>
                                </Td>
                                <Td>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {quote.title}
                                    </div>
                                    {quote.requirements && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                            {quote.requirements}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="text-gray-900 dark:text-gray-100">
                                        {quote.user?.profile?.full_name ||
                                            quote.contact?.name ||
                                            "未設定"}
                                    </div>
                                    {(quote.company?.name ||
                                        quote.contact?.company_name) && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {quote.company?.name ||
                                                quote.contact?.company_name}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {quote.user?.email ||
                                            quote.contact?.email ||
                                            "-"}
                                    </div>
                                </Td>
                                <Td>
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                        {formatAmount(
                                            quote.current_version?.total_amount,
                                        )}
                                    </div>
                                    {quote.current_version?.discount_amount >
                                        0 && (
                                        <div className="text-sm text-green-600 dark:text-green-400">
                                            割引:{" "}
                                            {formatAmount(
                                                quote.current_version
                                                    ?.discount_amount,
                                            )}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        variant={getQuoteStatusVariant(
                                            quote.status,
                                        )}
                                    >
                                        {getStatusLabel(quote.status)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <div
                                        className={
                                            quote.current_version?.expires_at &&
                                            new Date(
                                                quote.current_version
                                                    .expires_at,
                                            ) < new Date()
                                                ? "text-red-600 dark:text-red-400 font-medium"
                                                : "text-gray-900 dark:text-gray-100"
                                        }
                                    >
                                        {formatDate(
                                            quote.current_version?.expires_at,
                                        )}
                                    </div>
                                </Td>
                                <Td className="text-gray-900 dark:text-gray-100">
                                    {formatDate(quote.created_at)}
                                </Td>
                                <Td>
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.quote.show",
                                                quote.id,
                                            )}
                                            title="詳細"
                                        />
                                        {quote.status !== "approved" && (
                                            <IconButton
                                                variant="warning-text"
                                                icon={PencilIcon}
                                                size="lg"
                                                href={route(
                                                    "admin.quote.edit",
                                                    quote.id,
                                                )}
                                                title="編集"
                                            />
                                        )}
                                        <IconButton
                                            variant="text"
                                            icon={DocumentArrowDownIcon}
                                            size="lg"
                                            href={route(
                                                "admin.quote.pdf",
                                                quote.id,
                                            )}
                                            title="PDFダウンロード"
                                        />
                                        {quote.status !== "approved" && (
                                            <IconButton
                                                variant="danger-text"
                                                icon={TrashIcon}
                                                size="lg"
                                                onClick={() =>
                                                    onDelete(quote)
                                                }
                                                title="削除"
                                            />
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
