import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const PointRewardsTable = ({ pointRewards, onDelete }) => {
    return (
        <Card>
            <CardHeader>ポイント特典一覧 ({pointRewards.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>特典名</Th>
                        <Th>コード</Th>
                        <Th>付与ポイント</Th>
                        <Th>状態</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {pointRewards.data && pointRewards.data.length > 0 ? (
                        pointRewards.data.map((pointReward) => (
                            <Tr key={pointReward.id}>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {pointReward.name}
                                    </div>
                                    {pointReward.description && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {pointReward.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {pointReward.code}
                                    </code>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {pointReward.points.toLocaleString()}
                                        pt
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            pointReward.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {pointReward.is_active
                                            ? "有効"
                                            : "無効"}
                                    </Badge>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.point-reward.edit",
                                                pointReward.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                onDelete(pointReward)
                                            }
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
                                ポイント特典が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default PointRewardsTable;
