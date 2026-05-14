import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function Show({ category }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクトカテゴリ",
            href: route("admin.project-categories.index"),
        },
        { label: category.name, href: null },
    ];

    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.project-categories.edit", category.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={category.name}
                    description="プロジェクトカテゴリ詳細"
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title={category.name} />

            <FlashMessage />

            <div className="space-y-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    カテゴリ名
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    {category.icon && (
                                        <span className="text-2xl">
                                            {category.icon}
                                        </span>
                                    )}
                                    {category.name}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    スラッグ
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
                                        {category.slug}
                                    </code>
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    カラー
                                </dt>
                                <dd className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600"
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                    />
                                    <span className="text-slate-900 dark:text-slate-100">
                                        {category.color}
                                    </span>
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    ステータス
                                </dt>
                                <dd>
                                    {category.is_active ? (
                                        <Badge variant="success">
                                            アクティブ
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            非アクティブ
                                        </Badge>
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    表示順
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {category.sort_order}
                                </dd>
                            </div>

                            {category.description && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        説明
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                        {category.description}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* 関連プロジェクト */}
                {category.projects && category.projects.length > 0 && (
                    <Card>
                        <CardHeader>関連プロジェクト（最新10件）</CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {category.projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                                    >
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                                {project.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {project.project_code}
                                            </p>
                                        </div>
                                        <Link
                                            href={route(
                                                "admin.projects.show",
                                                project.id,
                                            )}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            詳細 →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* アクションボタン */}
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        href={route("admin.project-categories.index")}
                    >
                        一覧に戻る
                    </SecondaryButton>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
