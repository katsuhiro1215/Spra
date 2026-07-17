import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { FlashMessage } from "@/Components/Notifications";
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    pending: "info",
    contracted: "success",
    expired: "secondary",
    cancelled: "danger",
};

export default function Show({ referral }) {
    const canMarkContracted =
        referral.status !== "contracted" && !!referral.referred_company_id;

    const handleMarkContracted = () => {
        const confirmed = confirm(
            "この紹介を成立にし、紹介者・被紹介者双方にポイントを付与します。よろしいですか？",
        );
        if (confirmed) {
            router.post(
                route("admin.referral.mark-contracted", referral.id),
            );
        }
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.referral.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "secondary",
            route: route("admin.referral.edit", referral.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`紹介: ${referral.referral_code}`}
                    description="紹介の詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`紹介 - ${referral.referral_code}`} />

            <FlashMessage />

            <div className="space-y-4">
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    紹介コード
                                </dt>
                                <dd className="mt-1">
                                    <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {referral.referral_code}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ステータス
                                </dt>
                                <dd className="mt-1">
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                referral.status
                                            ] || "secondary"
                                        }
                                        size="sm"
                                    >
                                        {referral.status_label}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    紹介者（会社）
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {referral.referrer_company?.name || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    被紹介者（会社）
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {referral.referred_company?.name ||
                                        "未設定"}
                                </dd>
                            </div>
                        </div>

                        {referral.description && (
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    メモ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {referral.description}
                                </dd>
                            </div>
                        )}

                        {canMarkContracted && (
                            <div className="pt-2">
                                <button
                                    onClick={handleMarkContracted}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    成立にする（ポイント付与）
                                </button>
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <CardHeader>ポイント付与状況</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                紹介者への付与
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {referral.referrer_rewarded_at
                                    ? `${referral.referrer_points}pt（${new Date(referral.referrer_rewarded_at).toLocaleString("ja-JP")}）`
                                    : "未付与"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                被紹介者への付与
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {referral.referred_rewarded_at
                                    ? `${referral.referred_points}pt（${new Date(referral.referred_rewarded_at).toLocaleString("ja-JP")}）`
                                    : "未付与"}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        関連ポイント履歴 ({referral.transactions?.length || 0}
                        件)
                    </CardHeader>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>日時</Th>
                                <Th>会社</Th>
                                <Th>種別</Th>
                                <Th className="text-right">ポイント</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {referral.transactions &&
                            referral.transactions.length > 0 ? (
                                referral.transactions.map((transaction) => (
                                    <Tr key={transaction.id}>
                                        <Td>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(
                                                    transaction.created_at,
                                                ).toLocaleString("ja-JP")}
                                            </span>
                                        </Td>
                                        <Td>{transaction.description}</Td>
                                        <Td>
                                            <Badge variant="pink" size="xs">
                                                紹介ポイント
                                            </Badge>
                                        </Td>
                                        <Td className="text-right">
                                            <span
                                                className={
                                                    transaction.points >= 0
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }
                                            >
                                                {transaction.points >= 0
                                                    ? "+"
                                                    : ""}
                                                {transaction.points}pt
                                            </span>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={4}
                                        className="text-center text-slate-500 dark:text-slate-400 py-8"
                                    >
                                        まだポイントは付与されていません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
