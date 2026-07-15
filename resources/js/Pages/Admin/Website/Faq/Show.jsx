import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
// Icons
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Show({ faq }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.faq.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.faq.edit", faq.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="FAQ詳細"
                    description={faq.question}
                    actions={headerActions}
                />
            }
        >
            <Head title="FAQ詳細" />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                質問
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                {faq.question}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                回答
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                {faq.answer}
                            </dd>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    カテゴリ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {faq.faq_category ? (
                                        <Link
                                            href={route(
                                                "admin.website.faq.category.show",
                                                faq.faq_category.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                        >
                                            {faq.faq_category.name}
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    表示順
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {faq.sort_order ?? "-"}
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    faq.is_published ? "success" : "secondary"
                                }
                                size="sm"
                            >
                                {faq.is_published ? "公開中" : "非公開"}
                            </Badge>
                            {faq.is_featured && (
                                <Badge variant="info" size="sm">
                                    よくある質問
                                </Badge>
                            )}
                        </div>
                    </div>
                </Card>

                {/* 対象サービス */}
                {faq.services && faq.services.length > 0 && (
                    <Card>
                        <CardHeader>
                            対象サービス ({faq.services.length}件)
                        </CardHeader>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {faq.services.map((service) => (
                                    <Badge
                                        key={service.id}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {service.name}
                                    </Badge>
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
                                {new Date(faq.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(faq.updated_at).toLocaleString(
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
