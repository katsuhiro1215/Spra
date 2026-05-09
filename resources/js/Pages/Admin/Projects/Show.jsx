import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import {
    ArrowLeftIcon,
    PencilIcon,
    UserIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    DocumentTextIcon,
    FolderIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

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

export default function Show({ project }) {
    const [activeTab, setActiveTab] = useState("overview");

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

    const getPriorityBadge = (priority) => {
        return (
            priorityConfig[priority] || {
                variant: "secondary",
                label: priority,
            }
        );
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.projects.index"),
        },
    ];

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.projects.index") },
        { label: project.title },
    ];

    const tabs = [
        { id: "overview", label: "概要", icon: ClipboardDocumentListIcon },
        { id: "milestones", label: "マイルストーン", icon: FolderIcon },
        { id: "updates", label: "更新履歴", icon: ChatBubbleLeftRightIcon },
        { id: "files", label: "ファイル", icon: DocumentTextIcon },
    ];

    return (
        <AdminAuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} - プロジェクト詳細`} />

            <PageHeader
                title="プロジェクト"
                description="プロジェクトの詳細"
                actions={headerActions}
            />

            <FlashMessage />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {project.title}
                        </h1>
                        <Badge variant={getStatusBadge(project.status).variant}>
                            {getStatusBadge(project.status).label}
                        </Badge>
                        <Badge
                            variant={getPriorityBadge(project.priority).variant}
                        >
                            {getPriorityBadge(project.priority).label}
                        </Badge>
                    </div>

                    <SecondaryButton
                        href={route("admin.projects.edit", project.id)}
                        icon={PencilIcon}
                    >
                        編集
                    </SecondaryButton>
                </div>

                {/* プロジェクトコード */}
                {project.project_code && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg px-4 py-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            プロジェクトコード:{" "}
                        </span>
                        <span className="text-sm font-mono text-slate-900 dark:text-slate-100">
                            {project.project_code}
                        </span>
                    </div>
                )}

                {/* タブ */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                                        ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
                                        }
                                    `}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* タブコンテンツ */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            基本情報
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    {project.description && (
                                        <div className="mb-6">
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                                説明
                                            </dt>
                                            <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                                {project.description}
                                            </dd>
                                        </div>
                                    )}

                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                ステータス
                                            </dt>
                                            <dd className="mt-1">
                                                <Badge
                                                    variant={
                                                        getStatusBadge(
                                                            project.status,
                                                        ).variant
                                                    }
                                                >
                                                    {
                                                        getStatusBadge(
                                                            project.status,
                                                        ).label
                                                    }
                                                </Badge>
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                優先度
                                            </dt>
                                            <dd className="mt-1">
                                                <Badge
                                                    variant={
                                                        getPriorityBadge(
                                                            project.priority,
                                                        ).variant
                                                    }
                                                >
                                                    {
                                                        getPriorityBadge(
                                                            project.priority,
                                                        ).label
                                                    }
                                                </Badge>
                                            </dd>
                                        </div>
                                    </dl>
                                </CardBody>
                            </Card>

                            {/* 関連情報 */}
                            {(project.inquiry || project.contract) && (
                                <Card>
                                    <CardHeader>
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            関連情報
                                        </h2>
                                    </CardHeader>
                                    <CardBody>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {project.inquiry && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        問い合わせ
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {project.inquiry
                                                            .subject ||
                                                            `問い合わせ #${project.inquiry.id}`}
                                                    </dd>
                                                </div>
                                            )}

                                            {project.contract && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        契約
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {project.contract
                                                            .contract_number ||
                                                            `契約 #${project.contract.id}`}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </CardBody>
                                </Card>
                            )}

                            {/* クライアント向けノート */}
                            {project.client_visible_notes && (
                                <Card>
                                    <CardHeader>
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            クライアント向けノート
                                        </h2>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                            {project.client_visible_notes}
                                        </p>
                                    </CardBody>
                                </Card>
                            )}

                            {/* 内部ノート */}
                            {project.internal_notes && (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                内部ノート
                                            </h2>
                                            <Badge variant="warning" size="xs">
                                                内部のみ
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                            {project.internal_notes}
                                        </p>
                                    </CardBody>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* クライアント情報 */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            クライアント情報
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <dl className="space-y-4">
                                        {project.user && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    クライアント
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {project.user.name}
                                                </dd>
                                            </div>
                                        )}

                                        {project.company && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    企業
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {project.company.name}
                                                </dd>
                                            </div>
                                        )}

                                        {project.admin && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    担当管理者
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {project.admin.name}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </CardBody>
                            </Card>

                            {/* 日程 */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            日程
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <dl className="space-y-4">
                                        {project.start_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    開始日
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {formatDate(
                                                        project.start_date,
                                                    )}
                                                </dd>
                                            </div>
                                        )}

                                        {project.estimated_end_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    予定終了日
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {formatDate(
                                                        project.estimated_end_date,
                                                    )}
                                                </dd>
                                            </div>
                                        )}

                                        {project.actual_end_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    実際の終了日
                                                </dt>
                                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                    {formatDate(
                                                        project.actual_end_date,
                                                    )}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </CardBody>
                            </Card>

                            {/* カテゴリ */}
                            {project.categories &&
                                project.categories.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                カテゴリ
                                            </h2>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="flex flex-wrap gap-2">
                                                {project.categories.map(
                                                    (category) => (
                                                        <Badge
                                                            key={category.id}
                                                            variant="primary"
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                        </div>
                    </div>
                )}

                {activeTab === "milestones" && (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                マイルストーン機能は準備中です
                            </div>
                        </CardBody>
                    </Card>
                )}

                {activeTab === "updates" && (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                更新履歴機能は準備中です
                            </div>
                        </CardBody>
                    </Card>
                )}

                {activeTab === "files" && (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                ファイル機能は準備中です
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
