import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const FaqsTable = ({ faqs, onDelete }) => {
    return (
        <Card>
            <CardHeader>FAQ一覧 ({faqs.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>質問</Th>
                        <Th>カテゴリ</Th>
                        <Th>よくある質問</Th>
                        <Th>ステータス</Th>
                        <Th>表示順</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {faqs.data && faqs.data.length > 0 ? (
                        faqs.data.map((faq) => (
                            <Tr key={faq.id}>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 max-w-md truncate">
                                        {faq.question}
                                    </div>
                                </Td>
                                <Td>
                                    {faq.faq_category ? (
                                        <span
                                            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                                            style={{
                                                backgroundColor: `${
                                                    faq.faq_category.color ||
                                                    "#9CA3AF"
                                                }20`,
                                                color:
                                                    faq.faq_category.color ||
                                                    "#6B7280",
                                            }}
                                        >
                                            {faq.faq_category.name}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            faq.is_featured
                                                ? "info"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {faq.is_featured ? "対象" : "-"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            faq.is_published
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {faq.is_published
                                            ? "公開中"
                                            : "非公開"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {faq.sort_order || "-"}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.faq.show",
                                                faq.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.faq.edit",
                                                faq.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(faq)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                            title="削除"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                FAQが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default FaqsTable;
