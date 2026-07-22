import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import { TextButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

const statusConfig = {
    draft: { variant: "default", label: "下書き" },
    approved: { variant: "info", label: "承認済み" },
    active: { variant: "success", label: "有効" },
    superseded: { variant: "warning", label: "置き換え済み" },
    cancelled: { variant: "secondary", label: "キャンセル" },
};

export default function Index({ project, versions }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = (version) => {
        if (confirm("このバージョンを削除してもよろしいですか？")) {
            router.delete(
                route("admin.project.versions.destroy", {
                    project: project.id,
                    version: version.id,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const handleSetCurrent = (version) => {
        if (confirm("このバージョンを現在のバージョンとして設定しますか？")) {
            router.post(
                route("admin.project.versions.setCurrent", {
                    project: project.id,
                    version: version.id,
                }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`${project.title} - バージョン管理`}
                    description="プロジェクトバージョンの一覧と管理"
                    actions={[
                        {
                            label: "プロジェクトに戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route("admin.project.show", project.id),
                        },
                    ]}
                    breadcrumbs={[
                        { label: "ダッシュボード", href: "/admin/dashboard" },
                        {
                            label: "プロジェクト",
                            href: route("admin.project.index"),
                        },
                        {
                            label: project.title,
                            href: route("admin.project.show", project.id),
                        },
                        { label: "バージョン", href: null },
                    ]}
                />
            }
        >
            <Head title={`${project.title} - バージョン管理`} />

            <FlashMessage />

            <div className="space-y-6">
                {/* プロジェクト情報 */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            プロジェクト情報
                        </h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    プロジェクト名
                                </p>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {project.title}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    開始予定日
                                </p>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {formatDate(project.start_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    納期
                                </p>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {formatDate(project.estimated_end_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    ステータス
                                </p>
                                <Badge variant="info">{project.status}</Badge>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* バージョン一覧 */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                バージョン一覧
                            </h2>
                            <TextButton
                                href={route(
                                    "admin.project.versions.create",
                                    project.id,
                                )}
                                variant="primary"
                                size="sm"
                                title="新規バージョン作成"
                            >
                                <PlusIcon className="w-4 h-4 mr-1" />
                                新規バージョン作成
                            </TextButton>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {versions && versions.length > 0 ? (
                            <div className="space-y-3">
                                {versions.map((version) => (
                                    <div
                                        key={version.id}
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        v{version.version} -{" "}
                                                        {version.title}
                                                    </h3>
                                                    <Badge
                                                        variant={
                                                            statusConfig[
                                                                version.status
                                                            ]?.variant ||
                                                            "default"
                                                        }
                                                    >
                                                        {statusConfig[
                                                            version.status
                                                        ]?.label ||
                                                            version.status}
                                                    </Badge>
                                                    {version.is_current && (
                                                        <Badge variant="success">
                                                            現在のバージョン
                                                        </Badge>
                                                    )}
                                                </div>
                                                {version.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                        {version.description}
                                                    </p>
                                                )}
                                                <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                    <span>
                                                        作成:{" "}
                                                        {formatDate(
                                                            version.created_at,
                                                        )}
                                                    </span>
                                                    {version.revision_reason && (
                                                        <span>
                                                            修正理由:{" "}
                                                            {
                                                                version.revision_reason
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <TextButton
                                                    href={route(
                                                        "admin.project.versions.show",
                                                        {
                                                            project: project.id,
                                                            version: version.id,
                                                        },
                                                    )}
                                                    variant="primary"
                                                    size="sm"
                                                    title="詳細"
                                                >
                                                    <EyeIcon className="w-4 h-4 mr-1" />
                                                    詳細
                                                </TextButton>
                                                <TextButton
                                                    href={route(
                                                        "admin.project.versions.edit",
                                                        {
                                                            project: project.id,
                                                            version: version.id,
                                                        },
                                                    )}
                                                    variant="warning"
                                                    size="sm"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="w-4 h-4 mr-1" />
                                                    編集
                                                </TextButton>
                                                {!version.is_current && (
                                                    <TextButton
                                                        onClick={() =>
                                                            handleSetCurrent(
                                                                version,
                                                            )
                                                        }
                                                        variant="success"
                                                        size="sm"
                                                        title="現在に設定"
                                                    >
                                                        現在に設定
                                                    </TextButton>
                                                )}
                                                {!version.is_current && (
                                                    <TextButton
                                                        onClick={() =>
                                                            handleDelete(
                                                                version,
                                                            )
                                                        }
                                                        variant="danger"
                                                        size="sm"
                                                        title="削除"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                        削除
                                                    </TextButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-slate-500 dark:text-slate-400">
                                バージョンが登録されていません
                            </p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
