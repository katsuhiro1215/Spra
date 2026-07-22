import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";

const RatingStars = ({ rating }) => {
    if (!rating) {
        return <span className="text-sm text-slate-500">未設定</span>;
    }

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                    key={index}
                    className={`w-5 h-5 ${
                        index < rating
                            ? "text-amber-400"
                            : "text-slate-200 dark:text-slate-600"
                    }`}
                />
            ))}
        </div>
    );
};

export default function Show({ voice }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.voice.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.voice.edit", voice.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="お客様の声詳細"
                    description={voice.author_name}
                    actions={headerActions}
                />
            }
        >
            <Head title="お客様の声詳細" />

            <div className="space-y-4">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            {voice.avatar ? (
                                <img
                                    src={voice.avatar.url}
                                    alt={voice.author_name}
                                    className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xl font-semibold">
                                    {voice.author_name?.charAt(0) || "?"}
                                </div>
                            )}
                            <div>
                                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                    {voice.author_name}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {[voice.author_title, voice.company_name]
                                        .filter(Boolean)
                                        .join(" / ") || "-"}
                                </div>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                本文
                            </dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                {voice.content}
                            </dd>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    評価
                                </dt>
                                <dd className="mt-1">
                                    <RatingStars rating={voice.rating} />
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    表示順
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {voice.sort_order ?? "-"}
                                </dd>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    紐付けクライアント
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {voice.user
                                        ? voice.user.profile?.full_name ||
                                          voice.user.email
                                        : "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    対象サービス
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {voice.service ? (
                                        <Link
                                            href={route(
                                                "admin.service.show",
                                                voice.service.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                        >
                                            {voice.service.name}
                                        </Link>
                                    ) : (
                                        "全体向け"
                                    )}
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    voice.is_published
                                        ? "success"
                                        : "secondary"
                                }
                                size="sm"
                            >
                                {voice.is_published ? "公開中" : "非公開"}
                            </Badge>
                            {voice.is_featured && (
                                <Badge variant="info" size="sm">
                                    注目表示
                                </Badge>
                            )}
                        </div>
                    </div>
                </Card>

                {/* メタ情報 */}
                <Card>
                    <CardHeader>メタ情報</CardHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                作成日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(voice.created_at).toLocaleString(
                                    "ja-JP",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                更新日時
                            </span>
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                                {new Date(voice.updated_at).toLocaleString(
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
