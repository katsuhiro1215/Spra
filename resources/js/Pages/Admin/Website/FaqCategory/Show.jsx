import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Show({ category }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.faq.category.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.faq.category.edit", category.slug),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={category.name}
                    description="FAQカテゴリの詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`FAQカテゴリ - ${category.name}`} />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    カテゴリ名
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                category.color || "#9CA3AF",
                                        }}
                                    />
                                    {category.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    スラッグ
                                </dt>
                                <dd className="mt-1">
                                    <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </dd>
                            </div>
                        </div>

                        {category.description && (
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {category.description}
                                </dd>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    アイコン
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {category.icon || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    表示順
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {category.sort_order ?? "-"}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                ステータス
                            </dt>
                            <dd>
                                <Badge
                                    variant={
                                        category.is_active
                                            ? "success"
                                            : "secondary"
                                    }
                                    size="sm"
                                >
                                    {category.is_active ? "有効" : "無効"}
                                </Badge>
                            </dd>
                        </div>
                    </div>
                </Card>

                {/* 所属FAQ */}
                {category.faqs && category.faqs.length > 0 && (
                    <Card>
                        <CardHeader>
                            所属FAQ ({category.faqs.length}件)
                        </CardHeader>
                        <div className="p-6">
                            <div className="space-y-2">
                                {category.faqs.map((faq) => (
                                    <Link
                                        key={faq.id}
                                        href={route(
                                            "admin.website.faq.show",
                                            faq.id,
                                        )}
                                        className="block p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {faq.question}
                                            </span>
                                            <Badge
                                                variant={
                                                    faq.is_published
                                                        ? "success"
                                                        : "secondary"
                                                }
                                                size="xs"
                                            >
                                                {faq.is_published
                                                    ? "公開中"
                                                    : "非公開"}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* メタ情報 */}
                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(category.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(category.updated_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
