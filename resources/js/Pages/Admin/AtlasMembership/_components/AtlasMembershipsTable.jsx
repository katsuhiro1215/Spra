import React from "react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { PencilIcon } from "@heroicons/react/24/outline";

const BRAND_LABELS = {
    concierge: "Atlas Concierge",
    life: "Atlas Life",
    japan: "Atlas Japan",
};

const STATUS_LABELS = {
    pending: "審査中",
    active: "有効",
    paused: "一時停止",
    revoked: "失効",
};

const STATUS_VARIANTS = {
    pending: "warning",
    active: "success",
    paused: "secondary",
    revoked: "danger",
};

const AtlasMembershipsTable = ({ memberships }) => {
    return (
        <Card>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>ユーザー</Th>
                        <Th>ブランド</Th>
                        <Th>ステータス</Th>
                        <Th>有効化日時</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {memberships.data && memberships.data.length > 0 ? (
                        memberships.data.map((membership) => (
                            <Tr key={membership.id}>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {membership.user?.email}
                                    </div>
                                    {membership.note && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line">
                                            {membership.note}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {BRAND_LABELS[membership.brand] ??
                                            membership.brand}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[
                                                membership.status
                                            ] ?? "secondary"
                                        }
                                        size="xs"
                                    >
                                        {STATUS_LABELS[membership.status] ??
                                            membership.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {membership.activated_at
                                            ? new Date(
                                                  membership.activated_at,
                                              ).toLocaleString("ja-JP")
                                            : "-"}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <Link
                                        href={route(
                                            "admin.atlas-membership.edit",
                                            membership.id,
                                        )}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 inline-flex"
                                        title="編集"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </Link>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={5}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                Atlas会員が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default AtlasMembershipsTable;
