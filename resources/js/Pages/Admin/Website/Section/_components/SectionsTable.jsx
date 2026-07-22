import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const SectionsTable = ({ sections, onDelete }) => {
    return (
        <Card>
            <CardHeader>セクション一覧 ({sections.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>セクション名</Th>
                        <Th>ページ</Th>
                        <Th>役割</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {sections.data && sections.data.length > 0 ? (
                        sections.data.map((section) => (
                            <Tr key={section.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {section.sort_order || "-"}
                                    </span>
                                </Td>
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
                                        {new Date(
                                            section.created_at,
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
                                                "admin.website.section.show",
                                                section.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.section.edit",
                                                section.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(section)}
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
