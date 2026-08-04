import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Button from "@/Components/Buttons/Button";
import { FlashMessage } from "@/Components/Notifications";
import ProjectUpdateModal from "./_components/ProjectUpdateModal";
import { FormGroup, FileInput, TextInput, Checkbox } from "@/Components/Forms";
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
    ChartBarIcon,
    ArchiveBoxIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import {
    DOCUMENT_TYPE_LABELS,
    DOCUMENT_STATUS_LABELS,
} from "./Document/_shared/constants";

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

const ROLE_LABELS = {
    leader: "リーダー",
    designer: "デザイン担当",
    developer: "開発担当",
    manager: "マネージャー",
    other: "その他",
};

export default function Show({ project, currentVersion, progress = 0 }) {
    const [activeTab, setActiveTab] = useState("overview");
    const isCompleted = progress >= 100;

    // ===== 更新履歴（ProjectUpdate）作成・編集モーダル =====
    const emptyUpdateForm = () => ({
        title: "",
        content: "",
        type: "general",
        is_client_visible: false,
    });

    const {
        data: updateData,
        setData: setUpdateData,
        post: postUpdate,
        put: putUpdate,
        processing: updateProcessing,
        errors: updateErrors,
        reset: resetUpdateForm,
        clearErrors: clearUpdateErrors,
    } = useForm(emptyUpdateForm());

    const [updateModal, setUpdateModal] = useState({
        show: false,
        mode: "create",
        updateId: null,
    });

    const openCreateUpdateModal = () => {
        clearUpdateErrors();
        resetUpdateForm();
        setUpdateData(emptyUpdateForm());
        setUpdateModal({ show: true, mode: "create", updateId: null });
    };

    const openEditUpdateModal = (update) => {
        clearUpdateErrors();
        setUpdateData({
            title: update.title || "",
            content: update.content || "",
            type: update.type || "general",
            is_client_visible: update.is_client_visible ?? false,
        });
        setUpdateModal({ show: true, mode: "edit", updateId: update.id });
    };

    const closeUpdateModal = () => {
        setUpdateModal({ show: false, mode: "create", updateId: null });
        resetUpdateForm();
        clearUpdateErrors();
    };

    const handleUpdateModalSubmit = (e) => {
        e.preventDefault();
        if (updateModal.mode === "create") {
            postUpdate(route("admin.project.updates.store", project.id), {
                preserveScroll: true,
                onSuccess: () => closeUpdateModal(),
            });
        } else {
            putUpdate(
                route("admin.project.updates.update", {
                    project: project.id,
                    update: updateModal.updateId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => closeUpdateModal(),
                },
            );
        }
    };

    const handleDeleteUpdate = (update) => {
        if (confirm(`「${update.title}」を削除してもよろしいですか？`)) {
            router.delete(
                route("admin.project.updates.destroy", {
                    project: project.id,
                    update: update.id,
                }),
                { preserveScroll: true },
            );
        }
    };

    // ===== ファイルアップロード =====
    const {
        data: fileData,
        setData: setFileData,
        post: postFile,
        processing: fileProcessing,
        errors: fileErrors,
        reset: resetFileForm,
    } = useForm({
        file: null,
        description: "",
        is_client_visible: false,
    });

    const handleFileUpload = (e) => {
        e.preventDefault();
        postFile(route("admin.project.files.store", project.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => resetFileForm(),
        });
    };

    const handleDeleteFile = (file) => {
        if (confirm(`「${file.original_filename}」を削除してもよろしいですか？`)) {
            router.delete(
                route("admin.project.files.destroy", {
                    project: project.id,
                    file: file.id,
                }),
                { preserveScroll: true },
            );
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 B";
        const units = ["B", "KB", "MB", "GB"];
        const exponent = Math.min(
            Math.floor(Math.log(bytes) / Math.log(1024)),
            units.length - 1,
        );
        return `${(bytes / 1024 ** exponent).toFixed(1)} ${units[exponent]}`;
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
            variant: "ghost",
            route: route("admin.project.index"),
        },
    ];

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        { label: project.title },
    ];

    const tabs = [
        { id: "overview", label: "概要", icon: ClipboardDocumentListIcon },
        { id: "milestones", label: "マイルストーン", icon: FolderIcon },
        { id: "updates", label: "更新履歴", icon: ChatBubbleLeftRightIcon },
        { id: "gantt", label: "ガントチャート", icon: ChartBarIcon },
        { id: "documents", label: "ドキュメント", icon: ArchiveBoxIcon },
        { id: "files", label: "ファイル", icon: DocumentTextIcon },
    ];

    const documentsByType = Object.fromEntries(
        (project.documents || []).map((doc) => [doc.document_type, doc]),
    );

    const handleCreateDocument = (documentType) => {
        router.post(route("admin.project.documents.store", project.id), {
            document_type: documentType,
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`プロジェクト: ${project.title}`}
                    description={project.project_code || "プロジェクトの詳細"}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${project.title} - プロジェクト詳細`} />

            <FlashMessage />

            <div className="w-full space-y-6">
                {/* ステータス・アクション */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadge(project.status).variant}>
                            {getStatusBadge(project.status).label}
                        </Badge>
                        <Badge
                            variant={getPriorityBadge(project.priority).variant}
                        >
                            {getPriorityBadge(project.priority).label}
                        </Badge>
                        {isCompleted && (
                            <Badge variant="success">完了</Badge>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <SecondaryButton
                            href={route(
                                "admin.project.versions.index",
                                project.id,
                            )}
                            icon={FolderIcon}
                        >
                            バージョン管理
                        </SecondaryButton>
                        <SecondaryButton
                            href={route("admin.project.edit", project.id)}
                            icon={PencilIcon}
                        >
                            編集
                        </SecondaryButton>
                    </div>
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

                {/* 全体進捗 */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            全体進捗
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${
                                isCompleted ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                        />
                    </div>
                </div>

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

                            {/* 現在のバージョン */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FolderIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                現在のバージョン
                                            </h2>
                                        </div>
                                        <SecondaryButton
                                            href={route(
                                                "admin.project.versions.index",
                                                project.id,
                                            )}
                                            size="sm"
                                        >
                                            バージョン管理
                                        </SecondaryButton>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    {currentVersion ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                            v{currentVersion.version} - {currentVersion.title}
                                                        </h3>
                                                        <Badge variant="success">現在</Badge>
                                                    </div>
                                                    {currentVersion.description && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {currentVersion.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500">マイルストーン</p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        {currentVersion.milestones?.length || 0} 件
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500">アイテム</p>
                                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                        {currentVersion.items?.length || 0} 件
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <SecondaryButton
                                                    href={route(
                                                        "admin.project.versions.show",
                                                        [project.id, currentVersion.id],
                                                    )}
                                                    className="flex-1"
                                                >
                                                    バージョン詳細
                                                </SecondaryButton>
                                                <SecondaryButton
                                                    onClick={() => setActiveTab("gantt")}
                                                    className="flex-1"
                                                >
                                                    <ChartBarIcon className="w-4 h-4" />
                                                    ガントチャート
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                                プロジェクトバージョンがまだ作成されていません
                                            </p>
                                            <SecondaryButton
                                                href={route(
                                                    "admin.project.versions.create",
                                                    project.id,
                                                )}
                                            >
                                                最初のバージョンを作成
                                            </SecondaryButton>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* 関連情報 */}
                            {(project.contract || project.repository_url || project.production_url) && (
                                <Card>
                                    <CardHeader>
                                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                            関連情報
                                        </h2>
                                    </CardHeader>
                                    <CardBody>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                            {project.repository_url && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        リポジトリ
                                                    </dt>
                                                    <dd className="mt-1 text-sm">
                                                        <a
                                                            href={project.repository_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                                        >
                                                            {project.repository_url}
                                                        </a>
                                                    </dd>
                                                </div>
                                            )}

                                            {project.production_url && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        公開URL
                                                    </dt>
                                                    <dd className="mt-1 text-sm">
                                                        <a
                                                            href={project.production_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                                        >
                                                            {project.production_url}
                                                        </a>
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

                                        {project.admins &&
                                            project.admins.length > 0 && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        担当管理者
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 space-y-1">
                                                        {project.admins.map(
                                                            (admin) => (
                                                                <div
                                                                    key={
                                                                        admin.id
                                                                    }
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <span>
                                                                        {admin
                                                                            .profile
                                                                            ?.full_name ||
                                                                            admin.email}
                                                                    </span>
                                                                    <Badge
                                                                        variant={
                                                                            admin
                                                                                .pivot
                                                                                .role ===
                                                                            "leader"
                                                                                ? "primary"
                                                                                : "secondary"
                                                                        }
                                                                        size="sm"
                                                                    >
                                                                        {ROLE_LABELS[
                                                                            admin
                                                                                .pivot
                                                                                .role
                                                                        ] ||
                                                                            admin
                                                                                .pivot
                                                                                .role}
                                                                    </Badge>
                                                                </div>
                                                            ),
                                                        )}
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

                            {/* 使用技術 */}
                            {project.technologies &&
                                project.technologies.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                使用技術
                                            </h2>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.map(
                                                    (technology) => (
                                                        <Badge
                                                            key={technology.id}
                                                            variant="primary"
                                                        >
                                                            {technology.name}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}

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
                    <div className="space-y-6">
                        {!currentVersion ? (
                            <Card>
                                <CardBody>
                                    <div className="text-center py-12">
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                                            プロジェクトバージョンがまだ作成されていません
                                        </p>
                                        <SecondaryButton
                                            href={route(
                                                "admin.project.versions.create",
                                                project.id,
                                            )}
                                        >
                                            最初のバージョンを作成
                                        </SecondaryButton>
                                    </div>
                                </CardBody>
                            </Card>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                        現在のバージョン: v{currentVersion.version} - {currentVersion.title}
                                    </h2>
                                    <SecondaryButton
                                        href={route(
                                            "admin.project.versions.show",
                                            [project.id, currentVersion.id],
                                        )}
                                    >
                                        バージョン詳細を表示
                                    </SecondaryButton>
                                </div>

                                {currentVersion.milestones?.length > 0 ? (
                                    <div className="grid gap-4">
                                        {currentVersion.milestones.map(
                                            (milestone) => (
                                                <Card key={milestone.id}>
                                                    <CardBody>
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                                                    {milestone.title}
                                                                </h3>
                                                                {milestone.description && (
                                                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                                                        {milestone.description}
                                                                    </p>
                                                                )}
                                                                {milestone.due_date && (
                                                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                                                        期限: {formatDate(milestone.due_date)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Badge variant="info">
                                                                {milestone.status === "pending" && "未着手"}
                                                                {milestone.status === "in_progress" && "進行中"}
                                                                {milestone.status === "completed" && "完了"}
                                                                {milestone.status === "skipped" && "スキップ"}
                                                            </Badge>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardBody>
                                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                                マイルストーンがまだ作成されていません
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "updates" && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                icon={PlusIcon}
                                onClick={openCreateUpdateModal}
                            >
                                更新情報を追加
                            </Button>
                        </div>

                        {project.updates?.length > 0 ? (
                            <div className="space-y-4">
                                {project.updates.map((update) => (
                                    <Card key={update.id}>
                                        <CardBody>
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                                    {update.title}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-slate-500 dark:text-slate-500">
                                                        {formatDate(update.created_at)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditUpdateModal(update)}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                                    >
                                                        編集
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUpdate(update)}
                                                        className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            </div>
                                            {update.content && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                                    {update.content}
                                                </p>
                                            )}
                                            {update.admin && (
                                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                                    投稿者: {update.admin.profile?.full_name || update.admin.email}
                                                </p>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardBody>
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        更新履歴はまだありません
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === "gantt" && (
                    <div>
                        {!currentVersion ? (
                            <Card>
                                <CardBody className="py-12">
                                    <div className="text-center">
                                        <p className="mb-4 text-slate-600 dark:text-slate-400">
                                            ガントチャートを表示するには、まずプロジェクトバージョンを作成してください
                                        </p>
                                        <SecondaryButton
                                            href={route(
                                                "admin.project.versions.create",
                                                project.id,
                                            )}
                                        >
                                            バージョンを作成
                                        </SecondaryButton>
                                    </div>
                                </CardBody>
                            </Card>
                        ) : (
                            <Card>
                                <CardBody className="py-12">
                                    <div className="text-center">
                                        <p className="mb-4 text-slate-600 dark:text-slate-400">
                                            v{currentVersion.version} - {currentVersion.title} のガントチャートを表示
                                        </p>
                                        <Link
                                            href={route(
                                                "admin.project.gantt.show",
                                                project.id,
                                            )}
                                        >
                                            <SecondaryButton>
                                                <ChartBarIcon className="w-5 h-5" />
                                                ガントチャートを開く
                                            </SecondaryButton>
                                        </Link>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => {
                            const doc = documentsByType[type];
                            const currentDocVersion = doc?.current_version;
                            return (
                                <Card key={type}>
                                    <CardBody>
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                                {label}
                                            </h3>
                                            {doc ? (
                                                <Badge variant={doc.status === "confirmed" ? "success" : "info"}>
                                                    {DOCUMENT_STATUS_LABELS[doc.status] || doc.status}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">未作成</Badge>
                                            )}
                                        </div>

                                        {doc ? (
                                            <>
                                                {currentDocVersion && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                                                        現在の編集版: v{currentDocVersion.version}
                                                    </p>
                                                )}
                                                <SecondaryButton
                                                    href={route("admin.project.documents.show", [project.id, doc.id])}
                                                    className="w-full"
                                                >
                                                    開く
                                                </SecondaryButton>
                                            </>
                                        ) : (
                                            <SecondaryButton
                                                onClick={() => handleCreateDocument(type)}
                                                icon={PlusIcon}
                                                className="w-full"
                                            >
                                                作成する
                                            </SecondaryButton>
                                        )}
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {activeTab === "files" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                    ファイルをアップロード
                                </h3>
                            </CardHeader>
                            <CardBody>
                                <form
                                    onSubmit={handleFileUpload}
                                    className="space-y-4"
                                >
                                    <FormGroup label="ファイル" error={fileErrors.file} required>
                                        <FileInput
                                            onChange={(e) =>
                                                setFileData(
                                                    "file",
                                                    e.target.files[0] ?? null,
                                                )
                                            }
                                            maxSize={20 * 1024 * 1024}
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="説明"
                                        error={fileErrors.description}
                                    >
                                        <TextInput
                                            value={fileData.description}
                                            onChange={(e) =>
                                                setFileData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormGroup>

                                    <label className="flex items-center gap-2">
                                        <Checkbox
                                            checked={fileData.is_client_visible}
                                            onChange={(e) =>
                                                setFileData(
                                                    "is_client_visible",
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="text-sm text-gray-700 dark:text-slate-300">
                                            クライアントに公開する
                                        </span>
                                    </label>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={
                                                fileProcessing || !fileData.file
                                            }
                                        >
                                            アップロード
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>

                        {project.files?.length > 0 ? (
                            <div className="space-y-3">
                                {project.files.map((file) => (
                                    <Card key={file.id}>
                                        <CardBody>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <a
                                                        href={route(
                                                            "admin.project.files.download",
                                                            {
                                                                project: project.id,
                                                                file: file.id,
                                                            },
                                                        )}
                                                        className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                                    >
                                                        {file.original_filename}
                                                    </a>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                        {formatFileSize(file.file_size)}
                                                        {" ・ "}
                                                        {formatDate(file.created_at)}
                                                        {file.uploaded_by && (
                                                            <>
                                                                {" ・ "}
                                                                {file.uploaded_by.profile
                                                                    ?.full_name ||
                                                                    file.uploaded_by.email}
                                                            </>
                                                        )}
                                                        {file.is_client_visible && (
                                                            <>
                                                                {" ・ "}
                                                                <Badge
                                                                    variant="info"
                                                                    size="sm"
                                                                >
                                                                    クライアント公開
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </p>
                                                    {file.description && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {file.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteFile(file)
                                                    }
                                                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardBody>
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        ファイルはまだアップロードされていません
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            <ProjectUpdateModal
                show={updateModal.show}
                mode={updateModal.mode}
                data={updateData}
                setData={setUpdateData}
                errors={updateErrors}
                processing={updateProcessing}
                onSubmit={handleUpdateModalSubmit}
                onClose={closeUpdateModal}
            />
        </AdminAuthenticatedLayout>
    );
}
