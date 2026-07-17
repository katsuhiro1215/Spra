import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

const MembershipRanksTable = ({ membershipRanks, onDelete }) => {
    return (
        <Card>
            <CardHeader>会員ランク一覧 ({membershipRanks.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>ランク名</Th>
                        <Th>キー</Th>
                        <Th>しきい値（年間利用額）</Th>
                        <Th>状態</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {membershipRanks.data && membershipRanks.data.length > 0 ? (
                        membershipRanks.data.map((rank) => (
                            <Tr key={rank.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {rank.sort_order}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {rank.name}
                                    </div>
                                    {rank.description && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line">
                                            {rank.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {rank.key}
                                    </code>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {formatCurrency(
                                            rank.min_annual_amount,
                                        )}
                                        〜
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            rank.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {rank.is_active ? "有効" : "無効"}
                                    </Badge>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.membership-rank.edit",
                                                rank.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(rank)}
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
                                会員ランクが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default MembershipRanksTable;
