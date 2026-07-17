import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon } from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    pending: "info",
    approved: "success",
    rejected: "danger",
};

const PointRedemptionsTable = ({ redemptions }) => {
    return (
        <Card>
            <CardHeader>交換申請一覧 ({redemptions.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>申請日</Th>
                        <Th>会社</Th>
                        <Th>商品</Th>
                        <Th>消費ポイント</Th>
                        <Th>ステータス</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {redemptions.data && redemptions.data.length > 0 ? (
                        redemptions.data.map((redemption) => (
                            <Tr key={redemption.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            redemption.created_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {redemption.company?.name || "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {redemption.item_name}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {redemption.points_used.toLocaleString()}
                                        pt
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                redemption.status
                                            ] || "secondary"
                                        }
                                        size="xs"
                                    >
                                        {redemption.status_label}
                                    </Badge>
                                </Td>
                                <Td className="text-right">
                                    <Link
                                        href={route(
                                            "admin.point-redemption.show",
                                            redemption.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 inline-flex"
                                        title="詳細"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </Link>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                交換申請が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default PointRedemptionsTable;
