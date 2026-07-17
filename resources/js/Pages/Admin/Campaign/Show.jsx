import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";

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

export default function Show({ campaign }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.campaign.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.campaign.edit", campaign.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={campaign.name}
                    description="キャンペーンの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`キャンペーン - ${campaign.name}`} />

            <div className="space-y-4">
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    コード
                                </dt>
                                <dd className="mt-1">
                                    <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {campaign.code}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    状態
                                </dt>
                                <dd className="mt-1">
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                campaign.status_label
                                            ] || "secondary"
                                        }
                                        size="sm"
                                    >
                                        {campaign.status_label}
                                    </Badge>
                                </dd>
                            </div>
                        </div>

                        {campaign.description && (
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {campaign.description}
                                </dd>
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <CardHeader>割引設定</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                割引
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {formatDiscount(campaign)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                開始日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.starts_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                終了日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.ends_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(campaign.updated_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
