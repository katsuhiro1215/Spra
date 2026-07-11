import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { BlockPreview } from "@/Components/BlockUI";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ post }) {
    const handleDelete = () => {
        if (confirm(`「${post.title}」を削除しますか？この操作は取り消せません。`)) {
            router.delete(route("admin.website.post.destroy", post.id), {
                onSuccess: () => router.get(route("admin.website.post.index")),
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ja-JP");
    };

    const headerActions = [
        {
            label: PageConfig.posts.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.post.index"),
        },
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.website.post.edit", post.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={post.title}
                    description={PageConfig.posts.description}
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.posts.breadcrumbs,
                        PageConfig.posts.pages.show.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={`${PageConfig.posts.documentTitle} - ${post.title}`} />

            <FlashMessage />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* メインコンテンツ */}
                <div className="lg:col-span-2 space-y-6">
                    {post.thumbnail && (
                        <Card>
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>基本情報</CardHeader>
                        <CardBody>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        タイトル
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                        {post.title}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        スラッグ
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                        /{post.slug}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        ステータス
                                    </dt>
                                    <dd className="mt-1">
                                        <Badge
                                            variant={
                                                post.is_published
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            size="xs"
                                        >
                                            {post.is_published ? "公開" : "下書き"}
                                        </Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        作成者
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 flex items-center">
                                        <UserIcon className="w-4 h-4 mr-1" />
                                        {post.created_by?.name ||
                                            post.createdBy?.name ||
                                            "不明"}
                                    </dd>
                                </div>
                            </dl>

                            {post.excerpt && (
                                <div className="mt-6">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                        抜粋
                                    </dt>
                                    <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                        {post.excerpt}
                                    </dd>
                                </div>
                            )}

                            {(post.post_category || post.postCategory) && (
                                <div className="mt-6">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                        カテゴリ
                                    </dt>
                                    <dd>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            <TagIcon className="w-4 h-4 mr-1" />
                                            {
                                                (post.post_category ||
                                                    post.postCategory).name
                                            }
                                        </span>
                                    </dd>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>コンテンツ</CardHeader>
                        <CardBody>
                            <BlockPreview value={post.content} />
                        </CardBody>
                    </Card>

                    {(post.meta_title || post.meta_description) && (
                        <Card>
                            <CardHeader>SEO情報</CardHeader>
                            <CardBody>
                                <dl className="space-y-4">
                                    {post.meta_title && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                メタタイトル
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {post.meta_title}
                                            </dd>
                                        </div>
                                    )}
                                    {post.meta_description && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                メタディスクリプション
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {post.meta_description}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>
                    )}
                </div>

                {/* サイドバー */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>クイックアクション</CardHeader>
                        <CardBody className="space-y-3">
                            <Link
                                href={route("admin.website.post.edit", post.id)}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                編集
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                削除
                            </button>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <span className="flex items-center">
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                日付情報
                            </span>
                        </CardHeader>
                        <CardBody>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm text-slate-500 dark:text-slate-400">
                                        作成日
                                    </dt>
                                    <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {formatDate(post.created_at)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-slate-500 dark:text-slate-400">
                                        最終更新
                                    </dt>
                                    <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {formatDate(post.updated_at)}
                                    </dd>
                                </div>
                                {post.published_at && (
                                    <div>
                                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                                            公開日
                                        </dt>
                                        <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {formatDate(post.published_at)}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
