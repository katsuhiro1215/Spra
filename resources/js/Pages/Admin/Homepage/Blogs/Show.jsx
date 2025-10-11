import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    PhotoIcon,
    EyeIcon,
    ShareIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

const BlogShow = ({ blog }) => {
    const handleDelete = () => {
        if (
            confirm(
                `「${blog.title}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            router.delete(route("admin.homepage.blogs.destroy", blog.id), {
                onSuccess: () =>
                    router.get(route("admin.homepage.blogs.index")),
            });
        }
    };

    const handleStatusChange = (status) => {
        const published_at =
            status === "published"
                ? new Date().toISOString()
                : blog.published_at;

        router.patch(route("admin.homepage.blogs.change-status", blog.id), {
            status,
            published_at,
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            published: "bg-green-100 text-green-800",
            draft: "bg-yellow-100 text-yellow-800",
            scheduled: "bg-blue-100 text-blue-800",
        };

        const labels = {
            published: "公開",
            draft: "下書き",
            scheduled: "予約投稿",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ja-JP");
    };

    return (
        <AdminLayout>
            <Head title={`ブログ詳細 - ${blog.title}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(route("admin.homepage.blogs.index"))
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            ブログ一覧に戻る
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {blog.title}
                            </h1>
                            <p className="text-gray-600">ブログ詳細</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(blog.status)}
                            <select
                                value={blog.status}
                                onChange={(e) =>
                                    handleStatusChange(e.target.value)
                                }
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="draft">下書き</option>
                                <option value="published">公開</option>
                                <option value="scheduled">予約投稿</option>
                            </select>
                        </div>
                        <button
                            onClick={() =>
                                router.get(
                                    route("admin.homepage.blogs.edit", blog.id)
                                )
                            }
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            編集
                        </button>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            削除
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* メイン コンテンツ */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* アイキャッチ画像 */}
                        {blog.featured_media && (
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="aspect-video">
                                    <img
                                        src={blog.featured_media.url}
                                        alt={
                                            blog.featured_media.alt_text ||
                                            blog.title
                                        }
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 基本情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    基本情報
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            タイトル
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {blog.title}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            スラッグ
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            /{blog.slug}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            ステータス
                                        </dt>
                                        <dd className="mt-1">
                                            {getStatusBadge(blog.status)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            作成者
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                            <UserIcon className="w-4 h-4 mr-1" />
                                            {blog.admin?.name || "不明"}
                                        </dd>
                                    </div>
                                </dl>

                                {blog.excerpt && (
                                    <div className="mt-6">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">
                                            抜粋
                                        </dt>
                                        <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                                            {blog.excerpt}
                                        </dd>
                                    </div>
                                )}

                                {/* カテゴリ */}
                                {blog.categories &&
                                    blog.categories.length > 0 && (
                                        <div className="mt-6">
                                            <dt className="text-sm font-medium text-gray-500 mb-2">
                                                カテゴリ
                                            </dt>
                                            <dd className="flex flex-wrap gap-2">
                                                {blog.categories.map(
                                                    (category) => (
                                                        <span
                                                            key={category.id}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color +
                                                                    "20",
                                                                color: category.color,
                                                            }}
                                                        >
                                                            <TagIcon className="w-4 h-4 mr-1" />
                                                            {category.name}
                                                        </span>
                                                    )
                                                )}
                                            </dd>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* コンテンツ */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    コンテンツ
                                </h3>
                                <div className="prose max-w-none">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: blog.content,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ギャラリー */}
                        {blog.media && blog.media.length > 0 && (
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <PhotoIcon className="w-5 h-5 mr-2" />
                                        ギャラリー ({blog.media.length}枚)
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {blog.media.map((mediaItem) => (
                                            <div
                                                key={mediaItem.id}
                                                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={mediaItem.url}
                                                    alt={
                                                        mediaItem.alt_text ||
                                                        mediaItem.filename
                                                    }
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                    onClick={() =>
                                                        window.open(
                                                            mediaItem.url,
                                                            "_blank"
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEO情報 */}
                        {(blog.meta_title || blog.meta_description) && (
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        SEO情報
                                    </h3>
                                    <dl className="space-y-4">
                                        {blog.meta_title && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    メタタイトル
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {blog.meta_title}
                                                </dd>
                                            </div>
                                        )}
                                        {blog.meta_description && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    メタディスクリプション
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {blog.meta_description}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* サイドバー */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* クイックアクション */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    クイックアクション
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "admin.homepage.blogs.edit",
                                                    blog.id
                                                )
                                            )
                                        }
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        編集
                                    </button>

                                    {blog.status === "published" && (
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <EyeIcon className="w-4 h-4 mr-2" />
                                            サイトで表示
                                        </a>
                                    )}

                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/blog/${blog.slug}`;
                                            navigator.clipboard.writeText(url);
                                            alert(
                                                "URLをクリップボードにコピーしました"
                                            );
                                        }}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <ShareIcon className="w-4 h-4 mr-2" />
                                        URLをコピー
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 統計情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <ChartBarIcon className="w-5 h-5 mr-2" />
                                    統計情報
                                </h3>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            カテゴリ数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {blog.categories
                                                ? blog.categories.length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            ギャラリー画像
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {blog.media ? blog.media.length : 0}
                                            枚
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            文字数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {blog.content
                                                ? blog.content.replace(
                                                      /<[^>]*>/g,
                                                      ""
                                                  ).length
                                                : 0}
                                            文字
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* 日付情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    日付情報
                                </h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            作成日
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {formatDate(blog.created_at)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            最終更新
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {formatDate(blog.updated_at)}
                                        </dd>
                                    </div>
                                    {blog.published_at && (
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                公開日
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {formatDate(blog.published_at)}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* URL情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    URL情報
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <dt className="text-sm text-gray-500 mb-1">
                                            公開URL
                                        </dt>
                                        <dd className="text-sm bg-gray-50 px-3 py-2 rounded text-gray-700 break-all">
                                            /blog/{blog.slug}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500 mb-1">
                                            ID
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {blog.id}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BlogShow;
