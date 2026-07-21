import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { CONTRACT_TEMPLATE_TYPE_OPTIONS } from "@/Constants/SelectOptions";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ContractTemplateTable({ templates, onDelete }) {
    const templateTypeLabel = (value) =>
        CONTRACT_TEMPLATE_TYPE_OPTIONS.find((opt) => opt.value === value)
            ?.label || value;

    return (
        <Card>
            <CardHeader>契約書テンプレート一覧</CardHeader>
            <Table>
                <THead>
                    <Tr>
                        <Th>テンプレート名</Th>
                        <Th>種別</Th>
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
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {template.name}
                                    </span>
                                    {template.description && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                            {template.description}
                                        </p>
                                    )}
                                </Td>
                                <Td>
                                    <Badge variant="default" size="sm">
                                        {templateTypeLabel(
                                            template.template_type,
                                        )}
                                    </Badge>
                                </Td>
                                <Td>
                                    {template.status === "active" ? (
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
                                                "admin.contract.template.show",
                                                template.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.contract.template.edit",
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
                            <Td colSpan="5" className="text-center py-8">
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
