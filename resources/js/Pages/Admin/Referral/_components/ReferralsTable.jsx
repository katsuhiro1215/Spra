import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    pending: "info",
    contracted: "success",
    expired: "secondary",
    cancelled: "danger",
};

const ReferralsTable = ({ referrals, onDelete }) => {
    return (
        <Card>
            <CardHeader>紹介一覧 ({referrals.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>紹介コード</Th>
                        <Th>紹介者</Th>
                        <Th>被紹介者</Th>
                        <Th>ステータス</Th>
                        <Th>作成日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {referrals.data && referrals.data.length > 0 ? (
                        referrals.data.map((referral) => (
                            <Tr key={referral.id}>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {referral.referral_code}
                                    </code>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {referral.referrer_company?.name ||
                                            "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {referral.referred_company?.name ||
                                            "未設定"}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                referral.status
                                            ] || "secondary"
                                        }
                                        size="xs"
                                    >
                                        {referral.status_label}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            referral.created_at,
                                        ).toLocaleDateString("ja-JP")}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.referral.show",
                                                referral.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.referral.edit",
                                                referral.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(referral)}
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
                                紹介が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default ReferralsTable;
