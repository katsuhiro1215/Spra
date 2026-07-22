import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const PostCategoriesTable = ({ categories, onDelete }) => {
    return (
        <Card>
            <CardHeader>カテゴリ一覧 ({categories.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>カテゴリ名</Th>
                        <Th>スラッグ</Th>
                        <Th>親カテゴリ</Th>
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
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </Td>
                                <Td>
                                    {category.parent ? (
                                        <Link
                                            href={route(
                                                "admin.website.post.category.show",
                                                category.parent.id,
                                            )}
                                            className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {category.parent.name}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            -
                                        </span>
                                    )}
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
                                                "admin.website.post.category.show",
                                                category.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.post.category.edit",
                                                category.id,
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

export default PostCategoriesTable;
