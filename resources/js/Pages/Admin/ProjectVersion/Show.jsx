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
    PlusIcon,
    CheckIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

const statusConfig = {
    draft: { variant: "default", label: "下書き" },
    approved: { variant: "info", label: "承認済み" },
    active: { variant: "success", label: "有効" },
    superseded: { variant: "warning", label: "置き換え済み" },
    cancelled: { variant: "secondary", label: "キャンセル" },
};

export default function Show({ project, version, milestones, items }) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = () => {
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

    const handleSetCurrent = () => {
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

    const calculateProgress = () => {
        if (!items || items.length === 0) return 0;
        const completed = items.filter(
            (item) => item.status === "completed",
        ).length;
        return Math.round((completed / items.length) * 100);
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`v${version.version} - ${version.title}`}
                    description={`${project.title} のバージョン詳細`}
                    actions={[
                        {
                            label: "バージョン一覧へ戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route(
                                "admin.project.versions.index",
                                project.id,
                            ),
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
                        {
                            label: "バージョン",
                            href: route(
                                "admin.project.versions.index",
                                project.id,
                            ),
                        },
                        { label: `v${version.version}`, href: null },
                    ]}
                />
            }
        >
            <Head title={`v${version.version} - ${version.title}`} />

            <FlashMessage />

            <div className="space-y-6">
                {/* バージョン基本情報 */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                バージョン情報
                            </h2>
                            <div className="flex gap-2">
                                <TextButton
                                    href={route(
                                        "admin.project.gantt.show",
                                        project.id,
                                    )}
                                    variant="primary"
                                    size="sm"
                                    title="ガントチャート"
                                >
                                    <ChartBarIcon className="w-4 h-4 mr-1" />
                                    ガントチャート
                                </TextButton>
                                <TextButton
                                    href={route(
                                        "admin.project.versions.edit",
                                        {
                                            project: project.id,
                                            version: version.id,
                                        },
                                    )}
                                    variant="default"
                                    size="sm"
                                    title="編集"
                                >
                                    <PencilIcon className="w-4 h-4 mr-1" />
                                    編集
                                </TextButton>
                                {!version.is_current && (
                                    <TextButton
                                        onClick={handleSetCurrent}
                                        variant="success"
                                        size="sm"
                                        title="現在に設定"
                                    >
                                        <CheckIcon className="w-4 h-4 mr-1" />
                                        現在に設定
                                    </TextButton>
                                )}
                                {!version.is_current && (
                                    <TextButton
                                        onClick={handleDelete}
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
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        バージョン
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        v{version.version}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        タイトル
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {version.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        ステータス
                                    </p>
                                    <div className="mt-1">
                                        <Badge
                                            variant={
                                                statusConfig[version.status]
                                                    ?.variant || "default"
                                            }
                                        >
                                            {statusConfig[version.status]
                                                ?.label || version.status}
                                        </Badge>
                                        {version.is_current && (
                                            <Badge
                                                variant="success"
                                                className="ml-2"
                                            >
                                                現在のバージョン
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        開始予定日
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {formatDate(version.start_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        納期
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {formatDate(version.estimated_end_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        見積もり時間
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {version.total_estimated_hours || "-"}{" "}
                                        時間
                                    </p>
                                </div>
                            </div>
                        </div>

                        {version.description && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    説明
                                </p>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {version.description}
                                </p>
                            </div>
                        )}

                        {version.revision_reason && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    修正理由
                                </p>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {version.revision_reason}
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* マイルストーン */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                マイルストーン ({milestones?.length || 0})
                            </h2>
                            <TextButton
                                href={route(
                                    "admin.project.versions.milestones.create",
                                    {
                                        project: project.id,
                                        version: version.id,
                                    },
                                )}
                                variant="primary"
                                size="sm"
                                title="マイルストーンを追加"
                            >
                                <PlusIcon className="w-4 h-4 mr-1" />
                                追加
                            </TextButton>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {milestones && milestones.length > 0 ? (
                            <div className="space-y-3">
                                {milestones.map((milestone) => (
                                    <div
                                        key={milestone.id}
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex justify-between items-center"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                {milestone.title}
                                            </h3>
                                            {milestone.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {milestone.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {formatDate(
                                                    milestone.target_date,
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <TextButton
                                                href={route(
                                                    "admin.project.versions.milestones.edit",
                                                    {
                                                        project: project.id,
                                                        version: version.id,
                                                        milestone: milestone.id,
                                                    },
                                                )}
                                                variant="default"
                                                size="xs"
                                                title="編集"
                                            >
                                                <PencilIcon className="w-3 h-3" />
                                            </TextButton>
                                            <TextButton
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "このマイルストーンを削除しますか？",
                                                        )
                                                    ) {
                                                        router.delete(
                                                            route(
                                                                "admin.project.versions.milestones.destroy",
                                                                {
                                                                    project:
                                                                        project.id,
                                                                    version:
                                                                        version.id,
                                                                    milestone:
                                                                        milestone.id,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                                variant="danger"
                                                size="xs"
                                                title="削除"
                                            >
                                                <TrashIcon className="w-3 h-3" />
                                            </TextButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-slate-500 dark:text-slate-400">
                                マイルストーンが登録されていません
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* プロジェクトアイテム */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                プロジェクトアイテム ({items?.length || 0})
                            </h2>
                            <TextButton
                                href={route(
                                    "admin.project.versions.items.create",
                                    {
                                        project: project.id,
                                        version: version.id,
                                    },
                                )}
                                variant="primary"
                                size="sm"
                                title="アイテムを追加"
                            >
                                <PlusIcon className="w-4 h-4 mr-1" />
                                追加
                            </TextButton>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {items && items.length > 0 ? (
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {item.name}
                                                    </h3>
                                                    <Badge
                                                        variant={
                                                            item.status ===
                                                            "completed"
                                                                ? "success"
                                                                : item.status ===
                                                                    "in_progress"
                                                                  ? "warning"
                                                                  : "default"
                                                        }
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {item.estimated_hours && (
                                                        <span>
                                                            見積:{" "}
                                                            {
                                                                item.estimated_hours
                                                            }
                                                            時間
                                                        </span>
                                                    )}
                                                    {item.priority && (
                                                        <span>
                                                            優先度:{" "}
                                                            {item.priority}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <TextButton
                                                    href={route(
                                                        "admin.project.versions.items.edit",
                                                        {
                                                            project: project.id,
                                                            version: version.id,
                                                            item: item.id,
                                                        },
                                                    )}
                                                    variant="default"
                                                    size="xs"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="w-3 h-3" />
                                                </TextButton>
                                                <TextButton
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "このアイテムを削除しますか？",
                                                            )
                                                        ) {
                                                            router.delete(
                                                                route(
                                                                    "admin.project.versions.items.destroy",
                                                                    {
                                                                        project:
                                                                            project.id,
                                                                        version:
                                                                            version.id,
                                                                        item: item.id,
                                                                    },
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                    variant="danger"
                                                    size="xs"
                                                    title="削除"
                                                >
                                                    <TrashIcon className="w-3 h-3" />
                                                </TextButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-slate-500 dark:text-slate-400">
                                アイテムが登録されていません
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* アイテム統計 */}
                {items && items.length > 0 && (
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                アイテム進捗
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        完了率: {calculateProgress()}%
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {
                                            items.filter(
                                                (i) => i.status === "completed",
                                            ).length
                                        }{" "}
                                        / {items.length}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${calculateProgress()}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
