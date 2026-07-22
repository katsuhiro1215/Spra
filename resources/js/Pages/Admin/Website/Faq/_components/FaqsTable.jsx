import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const FaqsTable = ({ faqs, onDelete }) => {
    return (
        <Card>
            <CardHeader>FAQ一覧 ({faqs.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>質問</Th>
                        <Th>カテゴリ</Th>
                        <Th>よくある質問</Th>
                        <Th>ステータス</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {faqs.data && faqs.data.length > 0 ? (
                        faqs.data.map((faq) => (
                            <Tr key={faq.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {faq.sort_order || "-"}
                                    </span>
                                </Td>
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
                                <Td className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.faq.show",
                                                faq.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.faq.edit",
                                                faq.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(faq)}
                                            title="削除"
                                        />
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
