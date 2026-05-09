import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Table";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const statusConfig = {
    new: { variant: "info", label: "新規受付" },
    in_discussion: { variant: "warning", label: "相談中" },
    estimated: { variant: "default", label: "見積済み" },
    contracted: { variant: "success", label: "契約済み" },
    cancelled: { variant: "secondary", label: "キャンセル" },
};

export default function ProjectInquiriesTable({ inquiries, onDelete }) {
    const getStatusBadge = (status) => {
        const config = statusConfig[status] || {
            variant: "default",
            label: status,
        };
        return (
            <Badge variant={config.variant} size="sm">
                {config.label}
            </Badge>
        );
    };

    const formatBudget = (min, max) => {
        if (!min && !max) return "-";
        if (min && max) {
            return `¥${parseInt(min).toLocaleString()} - ¥${parseInt(max).toLocaleString()}`;
        }
        if (min) return `¥${parseInt(min).toLocaleString()}〜`;
        if (max) return `〜¥${parseInt(max).toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("ja-JP");
    };

    return (
        <Card>
            <CardHeader>プロジェクト問い合わせ一覧</CardHeader>
            <Table>
                <THead>
                    <Tr>
                        <Th>問い合わせ番号</Th>
                        <Th>タイトル</Th>
                        <Th>クライアント</Th>
                        <Th>予算</Th>
                        <Th>希望納期</Th>
                        <Th>ステータス</Th>
                        <Th>担当者</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {inquiries.data && inquiries.data.length > 0 ? (
                        inquiries.data.map((inquiry) => (
                            <Tr key={inquiry.id}>
                                <Td>
                                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                                        {inquiry.inquiry_code}
                                    </code>
                                </Td>
                                <Td>
                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                        {inquiry.title}
                                    </div>
                                    {inquiry.company && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {inquiry.company.name}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="text-sm">
                                        {inquiry.user?.name || "-"}
                                    </div>
                                    {inquiry.user?.email && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {inquiry.user.email}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {formatBudget(
                                            inquiry.budget_min,
                                            inquiry.budget_max,
                                        )}
                                    </span>
                                </Td>
                                <Td>
                                    {formatDate(inquiry.desired_delivery_date)}
                                </Td>
                                <Td>{getStatusBadge(inquiry.status)}</Td>
                                <Td>
                                    {inquiry.assigned_admin?.name || (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            未割当
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={route(
                                                "admin.project-inquiries.show",
                                                inquiry.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.project-inquiries.edit",
                                                inquiry.id,
                                            )}
                                            className="p-1 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                            title="編集"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(inquiry)}
                                            className="p-1 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                                            title="削除"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="8" className="text-center py-8">
                                <p className="text-slate-500 dark:text-slate-400">
                                    問い合わせが見つかりませんでした
                                </p>
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
}
