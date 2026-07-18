import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Show({ pageType }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.page.type.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.page.type.edit", pageType.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={pageType.name}
                    description="ページタイプの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`ページタイプ - ${pageType.name}`} />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    キー
                                </dt>
                                <dd className="mt-1">
                                    <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {pageType.key}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    スラッグ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {pageType.slug}
                                </dd>
                            </div>
                        </div>

                        {pageType.description && (
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {pageType.description}
                                </dd>
                            </div>
                        )}

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                タイプ
                            </dt>
                            <dd className="flex gap-2">
                                {pageType.is_system && (
                                    <Badge variant="info" size="sm">
                                        システムページ
                                    </Badge>
                                )}
                                {pageType.is_dynamic && (
                                    <Badge variant="success" size="sm">
                                        動的ページ
                                    </Badge>
                                )}
                                {pageType.has_detail && (
                                    <Badge variant="warning" size="sm">
                                        詳細ページあり
                                    </Badge>
                                )}
                            </dd>
                        </div>
                    </div>
                </Card>

                {/* メタ情報 */}
                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(pageType.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(pageType.updated_at).toLocaleString(
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
