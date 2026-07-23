import React from "react";
import { router } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

const BRAND_LABELS = {
    concierge: "Atlas Concierge",
    life: "Atlas Life",
    japan: "Atlas Japan",
};

const STATUS_LABELS = {
    unused: "未使用",
    used: "使用済み",
    revoked: "失効",
};

const STATUS_VARIANTS = {
    unused: "success",
    used: "secondary",
    revoked: "danger",
};

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("ja-JP") : "-";

const AtlasInviteCodesTable = ({ inviteCodes }) => {
    const handleRevoke = (inviteCode) => {
        if (confirm(`招待コード「${inviteCode.code}」を失効させますか？`)) {
            router.post(
                route("admin.atlas-invite-code.revoke", inviteCode.id),
            );
        }
    };

    return (
        <Card>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>コード</Th>
                        <Th>ブランド</Th>
                        <Th>ステータス</Th>
                        <Th>有効期限</Th>
                        <Th>使用者</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {inviteCodes.data && inviteCodes.data.length > 0 ? (
                        inviteCodes.data.map((inviteCode) => (
                            <Tr key={inviteCode.id}>
                                <Td>
                                    <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {inviteCode.code}
                                    </code>
                                    {inviteCode.note && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line mt-1">
                                            {inviteCode.note}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {BRAND_LABELS[inviteCode.brand] ??
                                            inviteCode.brand}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[
                                                inviteCode.status
                                            ] ?? "secondary"
                                        }
                                        size="xs"
                                    >
                                        {STATUS_LABELS[inviteCode.status] ??
                                            inviteCode.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {inviteCode.expires_at
                                            ? formatDateTime(
                                                  inviteCode.expires_at,
                                              )
                                            : "無期限"}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {inviteCode.used_by?.email ?? "-"}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    {inviteCode.status === "unused" && (
                                        <button
                                            onClick={() =>
                                                handleRevoke(inviteCode)
                                            }
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 inline-flex"
                                            title="失効"
                                        >
                                            <NoSymbolIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                招待コードが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default AtlasInviteCodesTable;
