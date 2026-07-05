import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ProjectTemplateTable({ templates, onDelete }) {
    return (
        <Card>
            <CardHeader>プロジェクトテンプレート一覧</CardHeader>
            <Table>
                <THead>
                    <Tr>
                        <Th>テンプレート名</Th>
                        <Th>説明</Th>
                        <Th>マイルストーン数</Th>
                        <Th>ステータス</Th>
                        <Th>表示順</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {templates && templates.length > 0 ? (
                        templates.map((template) => (
                            <Tr key={template.id}>
                                <Td>
                                    <div className="flex items-center gap-2">
                                        {template.icon && (
                                            <span className="text-xl">
                                                {template.icon}
                                            </span>
                                        )}
                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                            {template.name}
                                        </span>
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                        {template.description || "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge variant="default" size="sm">
                                        {template.milestones?.length || 0}
                                    </Badge>
                                </Td>
                                <Td>
                                    {template.is_active ? (
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
                                        {template.sort_order}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={route(
                                                "admin.project.template.show",
                                                template.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.project.template.edit",
                                                template.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="編集"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(template)}
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
                            <Td colSpan="6" className="text-center py-8">
                                <p className="text-slate-500 dark:text-slate-400">
                                    テンプレートが見つかりませんでした
                                </p>
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
}
