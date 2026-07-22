import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { BlockPreview } from "@/Components/BlockUI";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Show({ section }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.section.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.section.edit", section.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={section.name}
                    description="セクションの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`セクション - ${section.name}`} />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    セクション名
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {section.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ページ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {section.page?.title || "-"}
                                </dd>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    役割
                                </dt>
                                <dd className="mt-1">
                                    {section.role ? (
                                        <Badge variant="info" size="sm">
                                            {section.role}
                                        </Badge>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            -
                                        </span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    表示順
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {section.sort_order ?? "-"}
                                </dd>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* コンテンツ */}
                <Card>
                    <CardHeader>コンテンツ</CardHeader>
                    <div className="p-6">
                        <BlockPreview value={section.content} />
                    </div>
                </Card>

                {/* メタ情報 */}
                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成者
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {section.created_by_name ||
                                    section.created_by?.name ||
                                    "-"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(section.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(section.updated_at).toLocaleString(
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
