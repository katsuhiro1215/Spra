import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const SectionsTable = ({ sections, onDelete }) => {
    return (
        <Card>
            <CardHeader>セクション一覧 ({sections.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>セクション名</Th>
                        <Th>ページ</Th>
                        <Th>役割</Th>
                        <Th>表示順</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {sections.data && sections.data.length > 0 ? (
                        sections.data.map((section) => (
                            <Tr key={section.id}>
                                <Td>
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {section.name}
                                    </span>
                                </Td>
                                <Td>
                                    {section.page && (
                                        <Link
                                            href={route(
                                                "admin.website.page.show",
                                                section.page.id,
                                            )}
                                            className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {section.page.title}
                                        </Link>
                                    )}
                                </Td>
                                <Td>
                                    {section.role && (
                                        <Badge variant="info" size="xs">
                                            {section.role}
                                        </Badge>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {section.sort_order || "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            section.created_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.section.show",
                                                section.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.section.edit",
                                                section.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(section)}
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
                                セクションが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default SectionsTable;
