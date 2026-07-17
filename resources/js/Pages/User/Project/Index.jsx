import React, { useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import {
    CheckCircleIcon,
    ClockIcon,
    CalendarIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Index({ projects, filters }) {
    const statusConfig = {
        planning: { variant: "default", label: "計画中", icon: ClockIcon },
        design: { variant: "info", label: "デザイン中", icon: ClockIcon },
        development: { variant: "warning", label: "開発中", icon: ClockIcon },
        testing: { variant: "default", label: "テスト中", icon: ClockIcon },
        review: { variant: "info", label: "レビュー中", icon: ClockIcon },
        completed: { variant: "success", label: "完了", icon: CheckCircleIcon },
        on_hold: {
            variant: "secondary",
            label: "保留中",
            icon: ExclamationCircleIcon,
        },
        cancelled: {
            variant: "secondary",
            label: "キャンセル",
            icon: ExclamationCircleIcon,
        },
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        return statusConfig[status] || { variant: "secondary", label: status };
    };

    const filteredProjects = useMemo(() => {
        return projects.data;
    }, [projects.data]);

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "プロジェクト", href: "#" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="プロジェクト"
                    description="契約に基づくプロジェクト"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="プロジェクト" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {filteredProjects.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                    プロジェクトはまだありません
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    契約が成立するとプロジェクトが表示されます
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredProjects.map((project) => {
                            const statusBadge = getStatusBadge(project.status);
                            return (
                                <Link
                                    key={project.id}
                                    href={route(
                                        "user.projects.show",
                                        project.id,
                                    )}
                                >
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardBody>
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                {/* 左側: プロジェクト基本情報 */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                                    {
                                                                        project.title
                                                                    }
                                                                </h3>
                                                                <Badge
                                                                    variant={
                                                                        statusBadge.variant
                                                                    }
                                                                >
                                                                    {
                                                                        statusBadge.label
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                {project.description ||
                                                                    "説明なし"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 右側: 日付情報 */}
                                                <div className="flex flex-col gap-2 md:text-right md:flex-shrink-0">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            開始日
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {formatDate(
                                                                project.start_date,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            予定終了日
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {formatDate(
                                                                project.estimated_end_date,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 担当チーム */}
                                            {project.team &&
                                                project.team.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                            担当チーム
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            {project.team.map(
                                                                (
                                                                    member,
                                                                    idx,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex items-center gap-1.5"
                                                                        title={
                                                                            member.role_label
                                                                        }
                                                                    >
                                                                        {member.avatar_url ? (
                                                                            <img
                                                                                src={
                                                                                    member.avatar_url
                                                                                }
                                                                                alt={
                                                                                    member.name
                                                                                }
                                                                                className="w-6 h-6 rounded-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold">
                                                                                {
                                                                                    member.name
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                            {member.is_leader
                                                                                ? `${member.name}（${member.role_label}）`
                                                                                : member.role_label}
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* マイルストーン表示 */}
                                            {project.milestones &&
                                                project.milestones.length >
                                                    0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                            マイルストーン
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.milestones
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        milestone,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                milestone.id
                                                                            }
                                                                            className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                                                                        >
                                                                            {
                                                                                milestone.title
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            {project.milestones
                                                                .length > 3 && (
                                                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                                                    +
                                                                    {project
                                                                        .milestones
                                                                        .length -
                                                                        3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </CardBody>
                                    </Card>
                                </Link>
                            );
                        })}

                        {/* ページネーション */}
                        <UserPagination links={projects.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
