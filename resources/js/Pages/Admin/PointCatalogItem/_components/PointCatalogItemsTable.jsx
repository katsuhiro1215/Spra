import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const PointCatalogItemsTable = ({ pointCatalogItems, onDelete }) => {
    return (
        <Card>
            <CardHeader>
                カタログ商品一覧 ({pointCatalogItems.total}件)
            </CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>商品名</Th>
                        <Th>必要ポイント</Th>
                        <Th>状態</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {pointCatalogItems.data && pointCatalogItems.data.length > 0 ? (
                        pointCatalogItems.data.map((item) => (
                            <Tr key={item.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {item.sort_order}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {item.name}
                                    </div>
                                    {item.description && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {item.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {item.points_cost.toLocaleString()}pt
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            item.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {item.is_active ? "有効" : "無効"}
                                    </Badge>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.point-catalog-item.edit",
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
                                カタログ商品が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default PointCatalogItemsTable;
