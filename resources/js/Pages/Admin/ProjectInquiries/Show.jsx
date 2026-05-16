import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { PencilIcon } from "@heroicons/react/24/outline";

const statusConfig = {
    new: { variant: "info", label: "新規受付" },
    in_discussion: { variant: "warning", label: "相談中" },
    estimated: { variant: "default", label: "見積済み" },
    contracted: { variant: "success", label: "契約済み" },
    cancelled: { variant: "secondary", label: "キャンセル" },
};

export default function Show({ inquiry }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクト問い合わせ",
            href: route("admin.project-inquiries.index"),
        },
        { label: inquiry.inquiry_code, href: null },
    ];

    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.project-inquiries.edit", inquiry.id),
        },
    ];

    const statusBadge = statusConfig[inquiry.status] || {
        variant: "default",
        label: inquiry.status,
    };

    const formatBudget = (min, max) => {
        if (!min && !max) return "未設定";
        if (min && max) {
            return `¥${parseInt(min).toLocaleString()} - ¥${parseInt(max).toLocaleString()}`;
        }
        if (min) return `¥${parseInt(min).toLocaleString()}〜`;
        if (max) return `〜¥${parseInt(max).toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "未設定";
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={inquiry.inquiry_code}
                    description="プロジェクト問い合わせ詳細"
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title={inquiry.inquiry_code} />

            <FlashMessage />

            <div className="space-y-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    問い合わせ番号
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100 font-mono">
                                    {inquiry.inquiry_code}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    ステータス
                                </dt>
                                <dd>
                                    <Badge variant={statusBadge.variant}>
                                        {statusBadge.label}
                                    </Badge>
                                </dd>
                            </div>

                            <div className="md:col-span-2">
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    タイトル
                                </dt>
                                <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    {inquiry.title}
                                </dd>
                            </div>

                            {inquiry.summary && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        概要
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100 whitespace-pre-line">
                                        {inquiry.summary}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* クライアント情報 */}
                <Card>
                    <CardHeader>クライアント情報</CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    クライアント名
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {inquiry.user?.name || "-"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    メールアドレス
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {inquiry.user?.email || "-"}
                                </dd>
                            </div>

                            {inquiry.company && (
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        企業名
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100">
                                        <Link
                                            href={route(
                                                "admin.company.show",
                                                inquiry.company.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            {inquiry.company.name}
                                        </Link>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* プロジェクト詳細 */}
                <Card>
                    <CardHeader>プロジェクト詳細</CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    予算
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {formatBudget(
                                        inquiry.budget_min,
                                        inquiry.budget_max,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    希望納期
                                </dt>
                                <dd className="text-base text-slate-900 dark:text-slate-100">
                                    {formatDate(inquiry.desired_delivery_date)}
                                </dd>
                            </div>
                        </dl>
                    </CardBody>
                </Card>

                {/* ヒアリング・管理情報 */}
                <Card>
                    <CardHeader>ヒアリング・管理情報</CardHeader>
                    <CardBody>
                        <dl className="space-y-6">
                            {inquiry.hearing_notes && (
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        ヒアリング内容
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100 whitespace-pre-line bg-slate-50 dark:bg-slate-700/50 p-4 rounded">
                                        {inquiry.hearing_notes}
                                    </dd>
                                </div>
                            )}

                            {inquiry.admin_notes && (
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        管理者メモ
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100 whitespace-pre-line bg-amber-50 dark:bg-amber-900/20 p-4 rounded">
                                        {inquiry.admin_notes}
                                    </dd>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        担当管理者
                                    </dt>
                                    <dd className="text-base text-slate-900 dark:text-slate-100">
                                        {inquiry.assigned_admin?.name || (
                                            <span className="text-slate-400 dark:text-slate-500">
                                                未割当
                                            </span>
                                        )}
                                    </dd>
                                </div>

                                {inquiry.quote && (
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                            関連見積
                                        </dt>
                                        <dd className="text-base text-slate-900 dark:text-slate-100">
                                            <Link
                                                href={route(
                                                    "admin.quotes.show",
                                                    inquiry.quote.id,
                                                )}
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {inquiry.quote.quote_number}
                                            </Link>
                                        </dd>
                                    </div>
                                )}
                            </div>
                        </dl>
                    </CardBody>
                </Card>

                {/* 関連プロジェクト */}
                {inquiry.project && inquiry.project.length > 0 && (
                    <Card>
                        <CardHeader>関連プロジェクト</CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {inquiry.project.map((project) => (
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
                        href={route("admin.project-inquiries.index")}
                    >
                        一覧に戻る
                    </SecondaryButton>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
