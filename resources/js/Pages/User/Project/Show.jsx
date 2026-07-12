import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import GanttToolbar from "@/Components/GanttChart/GanttToolbar";
import GanttTimeline from "@/Components/GanttChart/GanttTimeline";
import GanttTaskList from "@/Components/GanttChart/GanttTaskList";
import GanttCanvas from "@/Components/GanttChart/GanttCanvas";
import {
    ArrowLeftIcon,
    CalendarIcon,
    UserIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export default function Show({ project }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [viewMode, setViewMode] = useState("month");

    const currentVersion = project.current_version;

    const ganttTasks = useMemo(() => {
        if (!currentVersion?.items?.length) return [];

        return currentVersion.items.map((item) => ({
            id: item.id,
            name: item.name,
            startDate: item.start_date,
            endDate: item.end_date,
            progress: item.progress ?? 0,
            status: item.status,
            priority: item.priority,
            description: item.description,
            resource:
                item.assignee?.profile?.full_name ||
                item.assignee?.email ||
                "",
            dependencies: [],
            children: [],
        }));
    }, [currentVersion]);

    const ganttDateRange = useMemo(() => {
        const startDate = currentVersion?.start_date
            ? new Date(currentVersion.start_date)
            : new Date();
        const endDate = currentVersion?.estimated_end_date
            ? new Date(currentVersion.estimated_end_date)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return { startDate, endDate };
    }, [currentVersion]);

    const statusConfig = {
        planning: { variant: "default", label: "計画中" },
        design: { variant: "info", label: "デザイン中" },
        development: { variant: "warning", label: "開発中" },
        testing: { variant: "default", label: "テスト中" },
        review: { variant: "info", label: "レビュー中" },
        completed: { variant: "success", label: "完了" },
        on_hold: { variant: "secondary", label: "保留中" },
        cancelled: { variant: "secondary", label: "キャンセル" },
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

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "プロジェクト", href: route("user.projects.index") },
        { label: project.title },
    ];

    const tabs = [
        { id: "overview", label: "概要" },
        { id: "milestones", label: "マイルストーン" },
        { id: "updates", label: "進捗状況" },
        { id: "gantt", label: "ガントチャート" },
    ];

    const statusBadge = getStatusBadge(project.status);

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title={project.title}
                    description={project.description || "プロジェクト詳細"}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={project.title} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {/* ステータスとアクション */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href={route("user.projects.index")}>
                                <SecondaryButton>
                                    <ArrowLeftIcon className="w-5 h-5" />
                                    戻る
                                </SecondaryButton>
                            </Link>
                            <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-8 px-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* コンテンツ領域 */}
                <div className="space-y-6">
                    {/* 概要タブ */}
                    {activeTab === "overview" && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* 基本情報 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>基本情報</CardTitle>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            プロジェクト名
                                        </label>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {project.title}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            ステータス
                                        </label>
                                        <p className="text-base">
                                            <Badge
                                                variant={statusBadge.variant}
                                            >
                                                {statusBadge.label}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            説明
                                        </label>
                                        <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                                            {project.description || "説明なし"}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* 日付情報 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>スケジュール</CardTitle>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            開始日
                                        </label>
                                        <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <CalendarIcon className="w-5 h-5" />
                                            {formatDate(project.start_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            予定終了日
                                        </label>
                                        <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <CalendarIcon className="w-5 h-5" />
                                            {formatDate(
                                                project.estimated_end_date,
                                            )}
                                        </p>
                                    </div>
                                    {project.actual_end_date && (
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                実際の終了日
                                            </label>
                                            <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                <CalendarIcon className="w-5 h-5" />
                                                {formatDate(
                                                    project.actual_end_date,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    )}

                    {/* マイルストーンタブ */}
                    {activeTab === "milestones" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>マイルストーン</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {project.milestones &&
                                project.milestones.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.milestones.map(
                                            (milestone, index) => (
                                                <div
                                                    key={milestone.id}
                                                    className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-medium">
                                                                    {index + 1}
                                                                </span>
                                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                                                    {
                                                                        milestone.title
                                                                    }
                                                                </h4>
                                                            </div>
                                                            {milestone.description && (
                                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    {
                                                                        milestone.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                期限
                                                            </p>
                                                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                                                {formatDate(
                                                                    milestone.due_date,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        マイルストーンはまだありません
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    )}

                    {/* 進捗状況タブ */}
                    {activeTab === "updates" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>進捗状況</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {project.updates &&
                                project.updates.length > 0 ? (
                                    <div className="space-y-6">
                                        {project.updates.map((update) => (
                                            <div
                                                key={update.id}
                                                className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {update.title}
                                                    </h4>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(
                                                            update.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                    {update.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        進捗状況がまだ報告されていません
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    )}

                    {/* ガントチャートタブ（閲覧のみ） */}
                    {activeTab === "gantt" && (
                        <Card>
                            <CardBody className="p-0">
                                {!currentVersion || ganttTasks.length === 0 ? (
                                    <p className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        表示できるタスクがまだありません
                                    </p>
                                ) : (
                                    <div className="h-[600px] flex flex-col">
                                        <GanttToolbar
                                            viewMode={viewMode}
                                            onViewModeChange={setViewMode}
                                            readOnly
                                        />
                                        <div className="flex-1 flex overflow-hidden">
                                            <div className="w-[500px] flex-shrink-0 overflow-y-auto">
                                                <GanttTaskList
                                                    tasks={ganttTasks}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col overflow-hidden">
                                                <div className="flex-shrink-0">
                                                    <GanttTimeline
                                                        viewMode={viewMode}
                                                        startDate={
                                                            ganttDateRange.startDate
                                                        }
                                                        endDate={
                                                            ganttDateRange.endDate
                                                        }
                                                    />
                                                </div>
                                                <div className="flex-1 overflow-auto">
                                                    <GanttCanvas
                                                        tasks={ganttTasks}
                                                        milestones={
                                                            project.milestones
                                                        }
                                                        viewMode={viewMode}
                                                        startDate={
                                                            ganttDateRange.startDate
                                                        }
                                                        endDate={
                                                            ganttDateRange.endDate
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
