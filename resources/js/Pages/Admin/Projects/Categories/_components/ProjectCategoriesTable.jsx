import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ProjectCategoriesTable({ categories, onDelete }) {
    return (
        <Card>
            <CardHeader>プロジェクトカテゴリ一覧</CardHeader>
            <Table>
                <THead>
                    <Tr>
                        <Th>カテゴリ名</Th>
                        <Th>スラッグ</Th>
                        <Th>カラー</Th>
                        <Th>プロジェクト数</Th>
                        <Th>ステータス</Th>
                        <Th>表示順</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {categories.data && categories.data.length > 0 ? (
                        categories.data.map((category) => (
                            <Tr key={category.id}>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        {category.icon && (
                                            <span className="text-xl">
                                                {category.icon}
                                            </span>
                                        )}
                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                            {category.name}
                                        </span>
                                    </div>
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </Td>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600"
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                        />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            {category.color}
                                        </span>
                                    </div>
                                </Td>
                                <Td>
                                    <Badge variant="default" size="sm">
                                        {category.projects_count || 0}
                                    </Badge>
                                </Td>
                                <Td>
                                    {category.is_active ? (
                                        <Badge variant="success" size="sm">
                                            アクティブ
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" size="sm">
                                            非アクティブ
                                        </Badge>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {category.sort_order}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={route(
                                                "admin.project-categories.show",
                                                category.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.project-categories.edit",
                                                category.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="編集"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(category)}
                                            className="p-1 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                                            title="削除"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="7" className="text-center py-8">
                                <p className="text-slate-500 dark:text-slate-400">
                                    カテゴリが見つかりませんでした
                                </p>
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
}
