import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    開催中: "success",
    開催前: "info",
    終了: "secondary",
    停止中: "danger",
};

const formatDiscount = (campaign) => {
    if (campaign.discount_type === "percentage") {
        return `${campaign.discount_value}% OFF`;
    }
    return `${new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(campaign.discount_value)} OFF`;
};

const formatDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const CampaignsTable = ({ campaigns, onDelete }) => {
    return (
        <Card>
            <CardHeader>キャンペーン一覧 ({campaigns.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>名前</Th>
                        <Th>コード</Th>
                        <Th>割引</Th>
                        <Th>期間</Th>
                        <Th>状態</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {campaigns.data && campaigns.data.length > 0 ? (
                        campaigns.data.map((campaign) => (
                            <Tr key={campaign.id}>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {campaign.name}
                                    </div>
                                    {campaign.description && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {campaign.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {campaign.code}
                                    </code>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-900 dark:text-slate-100">
                                        {formatDiscount(campaign)}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDateTime(campaign.starts_at)}
                                        {" 〜 "}
                                        {formatDateTime(campaign.ends_at)}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                campaign.status_label
                                            ] || "secondary"
                                        }
                                        size="xs"
                                    >
                                        {campaign.status_label}
                                    </Badge>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.campaign.show",
                                                campaign.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.campaign.edit",
                                                campaign.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(campaign)}
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
                                キャンペーンが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default CampaignsTable;
