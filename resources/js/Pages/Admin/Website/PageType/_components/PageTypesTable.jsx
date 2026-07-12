import React from "react";
import { Link } from "@inertiajs/react";
// Components
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
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
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.page-type.show",
                                                pageType.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.page-type.edit",
                                                pageType.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(pageType)}
                                            disabled={pageType.is_system}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={
                                                pageType.is_system
                                                    ? "システムページタイプは削除できません"
                                                    : "削除"
                                            }
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
