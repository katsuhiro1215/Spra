import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { Badge } from "@/Components/Badges";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    EnvelopeIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

const CATEGORY_LABELS = {
    general: "一般",
    estimate: "見積もり",
    technical: "技術",
    sales: "営業",
    support: "サポート",
    other: "その他",
};

// プレビュー用のサンプルデータ（実際の送信内容ではなく、見た目確認用）
const SAMPLE_DATA = {
    contact_name: "山田 太郎",
    contact_email: "yamada@example.com",
    contact_company: "サンプル株式会社",
    contact_phone: "03-1234-5678",
    contact_subject: "サービスについてのお問い合わせ",
    contact_message: "サービス内容について詳しく知りたいです。",
    admin_name: "担当者名",
    today: new Date().toLocaleDateString("ja-JP"),
    app_name: "Spra",
};

const applySampleData = (text = "") =>
    Object.entries(SAMPLE_DATA).reduce(
        (acc, [key, value]) => acc.split(`{${key}}`).join(value),
        text,
    );

export default function Show({ template, placeholders = {} }) {
    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.response.template.edit", template.id),
        },
        {
            label: PageConfig.responseTemplates.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.response.template.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.responseTemplates.breadcrumbs,
        template.name,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`🔖 ${template.name}`}
                    description={PageConfig.responseTemplates.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`テンプレート詳細 - ${template.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* メインコンテンツ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* テンプレート内容（生データ） */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <EnvelopeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                <CardTitle>テンプレート内容</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        件名
                                    </div>
                                    <p className="text-slate-900 dark:text-slate-100">
                                        {template.subject}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        本文
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                        <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                            {template.body}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* プレビュー（サンプルデータ適用） */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <EyeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                <CardTitle>プレビュー</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                プレースホルダーにサンプルデータを当てはめた場合の見た目です。実際の送信内容とは異なります。
                            </p>
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        件名
                                    </div>
                                    <div className="text-slate-900 dark:text-slate-100 font-medium">
                                        {applySampleData(template.subject)}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                        {applySampleData(template.body)}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* サイドバー */}
                <div className="space-y-6">
                    {/* 基本情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>基本情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Dl variant="default">
                                <div className="flex items-center gap-2">
                                    <Dt>カテゴリ:</Dt>
                                    <Dd>
                                        {CATEGORY_LABELS[template.category] ||
                                            template.category}
                                    </Dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dt>ステータス:</Dt>
                                    <Dd>
                                        <Badge
                                            variant={
                                                template.status === "active"
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            size="xs"
                                        >
                                            {template.status === "active"
                                                ? "有効"
                                                : "無効"}
                                        </Badge>
                                    </Dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dt>表示順:</Dt>
                                    <Dd>{template.sort_order}</Dd>
                                </div>
                                {template.placeholders && (
                                    <div className="flex items-start gap-2">
                                        <Dt>使用プレースホルダー:</Dt>
                                        <Dd className="break-all">
                                            {template.placeholders}
                                        </Dd>
                                    </div>
                                )}
                                {template.creator && (
                                    <div className="flex items-center gap-2">
                                        <Dt>作成者:</Dt>
                                        <Dd>{template.creator.email}</Dd>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Dt>作成日時:</Dt>
                                    <Dd>
                                        {new Date(
                                            template.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </Dd>
                                </div>
                                {template.updater && (
                                    <div className="flex items-center gap-2">
                                        <Dt>最終更新者:</Dt>
                                        <Dd>{template.updater.email}</Dd>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Dt>最終更新:</Dt>
                                    <Dd>
                                        {new Date(
                                            template.updated_at,
                                        ).toLocaleString("ja-JP")}
                                    </Dd>
                                </div>
                            </Dl>
                        </CardBody>
                    </Card>

                    {/* 利用可能なプレースホルダー */}
                    <Card>
                        <CardHeader>
                            <CardTitle>利用可能なプレースホルダー</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2">
                                {Object.entries(placeholders).map(
                                    ([token, label]) => (
                                        <div
                                            key={token}
                                            className="flex items-center justify-between gap-2 text-sm"
                                        >
                                            <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                                                {token}
                                            </code>
                                            <span className="text-slate-500 dark:text-slate-400">
                                                {label}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
