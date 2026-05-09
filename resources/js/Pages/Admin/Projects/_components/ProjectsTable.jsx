import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badge";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const statusConfig = {
    planning: { variant: "default", label: "計画中" },
    design: { variant: "info", label: "デザイン中" },
    development: { variant: "warning", label: "開発中" },
    testing: { variant: "default", label: "テスト中" },
    review: { variant: "info", label: "レビュー中" },
    completed: { variant: "success", label: "完了" },
    on_hold: { variant: "secondary", label: "保留" },
    cancelled: { variant: "secondary", label: "キャンセル" },
};

const priorityConfig = {
    low: { variant: "default", label: "低" },
    medium: { variant: "info", label: "中" },
    high: { variant: "warning", label: "高" },
    urgent: { variant: "danger", label: "緊急" },
};

const ProjectsTable = ({ projects, onDelete }) => {
    const getStatusBadge = (status) => {
        return statusConfig[status] || { variant: "secondary", label: status };
    };

    const getPriorityBadge = (priority) => {
        return (
            priorityConfig[priority] || {
                variant: "secondary",
                label: priority,
            }
        );
    };

    return (
        <Card>
            <CardHeader>プロジェクト一覧 ({projects.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>コード</Th>
                        <Th>タイトル</Th>
                        <Th>クライアント</Th>
                        <Th>カテゴリ</Th>
                        <Th>ステータス</Th>
                        <Th>優先度</Th>
                        <Th>担当者</Th>
                        <Th>開始日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {projects.data.length === 0 ? (
                        <Tr>
                            <Td
                                colSpan={9}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                プロジェクトが見つかりません
                            </Td>
                        </Tr>
                    ) : (
                        projects.data.map((project) => (
                            <Tr key={project.id}>
                                <Td>
                                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                                        {project.project_code}
                                    </span>
                                </Td>
                                <Td>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {project.title}
                                        </div>
                                        {project.description && (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                                {project.description}
                                            </div>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    {project.user ? (
                                        <div className="text-sm text-slate-900 dark:text-slate-100">
                                            {project.user.name}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    {project.categories &&
                                    project.categories.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {project.categories.map(
                                                (category) => (
                                                    <Badge
                                                        key={category.id}
                                                        variant="primary"
                                                        size="xs"
                                                    >
                                                        {category.name}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            getStatusBadge(project.status)
                                                .variant
                                        }
                                        size="xs"
                                    >
                                        {getStatusBadge(project.status).label}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            getPriorityBadge(project.priority)
                                                .variant
                                        }
                                        size="xs"
                                    >
                                        {
                                            getPriorityBadge(project.priority)
                                                .label
                                        }
                                    </Badge>
                                </Td>
                                <Td>
                                    {project.admin ? (
                                        <div className="text-sm text-slate-900 dark:text-slate-100">
                                            {project.admin.name}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            未割り当て
                                        </span>
                                    )}
                                </Td>
                                <Td className="text-slate-500 dark:text-slate-400">
                                    {project.start_date
                                        ? new Date(
                                              project.start_date,
                                          ).toLocaleDateString("ja-JP")
                                        : "-"}
                                </Td>
                                <Td>
                                    <div className="flex justify-end items-center gap-2">
                                        <Link
                                            href={route(
                                                "admin.projects.show",
                                                project.id,
                                            )}
                                            className="p-1 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.projects.edit",
                                                project.id,
                                            )}
                                            className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                            title="編集"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(project)}
                                            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="削除"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default ProjectsTable;
