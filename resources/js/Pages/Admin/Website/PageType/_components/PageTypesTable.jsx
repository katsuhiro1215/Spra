import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const PageTypesTable = ({ pageTypes, onDelete }) => {
    return (
        <Card>
            <CardHeader>ページタイプ一覧 ({pageTypes.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>名前</Th>
                        <Th>キー</Th>
                        <Th>スラッグ</Th>
                        <Th>タイプ</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {pageTypes.data && pageTypes.data.length > 0 ? (
                        pageTypes.data.map((pageType) => (
                            <Tr key={pageType.id}>
                                <Td>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {pageType.name}
                                        </div>
                                        {pageType.description && (
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {pageType.description}
                                            </div>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {pageType.key}
                                    </code>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {pageType.slug}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="flex gap-1">
                                        {pageType.is_system && (
                                            <Badge variant="info" size="xs">
                                                システム
                                            </Badge>
                                        )}
                                        {pageType.is_dynamic && (
                                            <Badge variant="success" size="xs">
                                                動的
                                            </Badge>
                                        )}
                                        {pageType.has_detail && (
                                            <Badge variant="warning" size="xs">
                                                詳細あり
                                            </Badge>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            pageType.created_at,
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
                                                "admin.website.page.type.show",
                                                pageType.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.page.type.edit",
                                                pageType.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            disabled={pageType.is_system}
                                            onClick={() => onDelete(pageType)}
                                            title={
                                                pageType.is_system
                                                    ? "システムページタイプは削除できません"
                                                    : "削除"
                                            }
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
                                ページタイプが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default PageTypesTable;
