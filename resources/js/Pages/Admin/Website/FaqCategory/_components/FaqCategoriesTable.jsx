import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const FaqCategoriesTable = ({ categories, onDelete }) => {
    return (
        <Card>
            <CardHeader>カテゴリ一覧 ({categories.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>カテゴリ名</Th>
                        <Th>スラッグ</Th>
                        <Th>FAQ件数</Th>
                        <Th>ステータス</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {categories.data && categories.data.length > 0 ? (
                        categories.data.map((category) => (
                            <Tr key={category.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {category.sort_order || "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    category.color ||
                                                    "#9CA3AF",
                                            }}
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {category.name}
                                            </div>
                                            {category.description && (
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {category.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {category.faqs_count ??
                                            category.faqs?.length ??
                                            0}
                                        件
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            category.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {category.is_active ? "有効" : "無効"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            category.created_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.faq.category.show",
                                                category.slug,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.faq.category.edit",
                                                category.slug,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(category)}
                                            title="削除"
                                        />
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={7}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                カテゴリが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default FaqCategoriesTable;
