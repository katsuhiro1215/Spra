import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const formatEventDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

const HistoryTable = ({ histories, onDelete }) => {
    return (
        <Card>
            <CardHeader>沿革一覧 ({histories.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>年月</Th>
                        <Th>タイトル</Th>
                        <Th>ステータス</Th>
                        <Th>表示順</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {histories.data && histories.data.length > 0 ? (
                        histories.data.map((item) => (
                            <Tr key={item.id}>
                                <Td>
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {formatEventDate(item.event_date)}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {item.title}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            item.is_published
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {item.is_published ? "公開" : "非公開"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {item.sort_order ?? "-"}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.organization.history.edit",
                                                item.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(item)}
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
                                colSpan={5}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                沿革が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default HistoryTable;
