import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PageConfig } from "@/Constants/PageConfig";
import {
    PencilIcon,
    ArrowLeftIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

export default function Show({ template }) {
    // ========================================
    // Handlers
    // ========================================
    const handleDeleteMilestone = (milestone) => {
        const confirmed = confirm(
            `${milestone.milestone_name} を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(
                route("admin.project.template.milestone.destroy", [
                    template.id,
                    milestone.id,
                ]),
            );
        }
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.projectTemplates.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.template.index"),
        },
        {
            label: PageConfig.projectTemplates.actions.edit,
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.project.template.edit", template.id),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.projectTemplates.breadcrumbs,
        PageConfig.projectTemplates.pages.show.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.projectTemplates.pages.show.title.replace(
                        "{name}",
                        template.name,
                    )}
                    description={PageConfig.projectTemplates.pages.show.description.replace(
                        "{name}",
                        template.name,
                    )}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={PageConfig.projectTemplates.pages.show.title.replace(
                    "{name}",
                    template.name,
                )}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 基本情報 */}
                    <Card>
                        <CardHeader>基本情報</CardHeader>
                        <CardBody>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        テンプレート名
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        {template.icon && (
                                            <span className="text-2xl">
                                                {template.icon}
                                            </span>
                                        )}
                                        {template.name}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        ステータス
                                    </dt>
                                    <dd>
                                        {template.is_active ? (
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
                                        {template.sort_order}
                                    </dd>
                                </div>

                                {template.description && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                            説明
                                        </dt>
                                        <dd className="text-base text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                            {template.description}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardBody>
                    </Card>

                    {/* マイルストーン */}
                    <Card>
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                マイルストーン
                                {template.milestones &&
                                    template.milestones.length > 0 && (
                                        <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                                            ({template.milestones.length}個)
                                        </span>
                                    )}
                            </h3>
                            <Link
                                href={route(
                                    "admin.project.template.milestone.create",
                                    template.id,
                                )}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <PlusIcon className="h-4 w-4" />
                                追加
                            </Link>
                        </div>
                        <CardBody>
                            {template.milestones &&
                            template.milestones.length > 0 ? (
                                <div className="space-y-3">
                                    {template.milestones.map((milestone) => (
                                        <div
                                            key={milestone.id}
                                            className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-blue-600 rounded-full">
                                                        {milestone.order}
                                                    </span>
                                                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                                        {
                                                            milestone.milestone_name
                                                        }
                                                    </h4>
                                                </div>
                                                {milestone.description && (
                                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                        {milestone.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Link
                                                    href={route(
                                                        "admin.project.template.milestone.edit",
                                                        [
                                                            template.id,
                                                            milestone.id,
                                                        ],
                                                    )}
                                                    className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteMilestone(
                                                            milestone,
                                                        )
                                                    }
                                                    className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                                                    title="削除"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 dark:text-slate-400">
                                        マイルストーンがまだ追加されていません
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
