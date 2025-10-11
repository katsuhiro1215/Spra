import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    TagIcon,
    DocumentTextIcon,
    CalendarIcon,
    ChartBarIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

const BlogCategoryShow = ({ category }) => {
    const handleDelete = () => {
        if (
            confirm(
                `「${category.name}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            router.delete(
                route("admin.homepage.blogCategories.destroy", category.id),
                {
                    onSuccess: () =>
                        router.get(
                            route("admin.homepage.blogCategories.index")
                        ),
                }
            );
        }
    };

    function getContrastColor(hexColor) {
        const hex = hexColor.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155 ? "#000000" : "#ffffff";
    }

    return (
        <AdminLayout>
            <Head title={`ブログカテゴリ詳細 - ${category.name}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(
                                    route("admin.homepage.blogCategories.index")
                                )
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            カテゴリ一覧に戻る
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <div
                                    className="w-6 h-6 rounded-full mr-3 border"
                                    style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                            </h1>
                            <p className="text-gray-600">ブログカテゴリ詳細</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() =>
                                router.get(
                                    route(
                                        "admin.homepage.blogCategories.edit",
                                        category.id
                                    )
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
                    {/* メイン情報 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 基本情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    基本情報
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            カテゴリ名
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {category.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            スラッグ
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            /{category.slug}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            カラーコード
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                            <div
                                                className="w-4 h-4 rounded border mr-2"
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            ></div>
                                            {category.color}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            並び順
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {category.sort_order}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            ステータス
                                        </dt>
                                        <dd className="mt-1">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    category.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {category.is_active
                                                    ? "有効"
                                                    : "無効"}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            投稿数
                                        </dt>
                                        <dd className="mt-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {category.blogs
                                                    ? category.blogs.length
                                                    : 0}
                                                件
                                            </span>
                                        </dd>
                                    </div>
                                </dl>

                                {category.description && (
                                    <div className="mt-6">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">
                                            説明
                                        </dt>
                                        <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                                            {category.description}
                                        </dd>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* プレビュー */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <EyeIcon className="w-5 h-5 mr-2" />
                                    表示プレビュー
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* カテゴリタグ */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            カテゴリタグ
                                        </p>
                                        <div
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: category.color,
                                                color: getContrastColor(
                                                    category.color
                                                ),
                                            }}
                                        >
                                            <TagIcon className="w-4 h-4 mr-1" />
                                            {category.name}
                                        </div>
                                    </div>

                                    {/* カテゴリバッジ */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            カテゴリバッジ
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            ></div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {category.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* URL情報 */}
                                <div className="mt-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        URL
                                    </p>
                                    <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700 break-all">
                                        /category/{category.slug}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 関連ブログ */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                                    関連ブログ (
                                    {category.blogs ? category.blogs.length : 0}
                                    件)
                                </h3>

                                {category.blogs && category.blogs.length > 0 ? (
                                    <div className="space-y-4">
                                        {category.blogs.map((blog) => (
                                            <div
                                                key={blog.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                            {blog.title}
                                                        </h4>
                                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                    blog.status ===
                                                                    "published"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : blog.status ===
                                                                          "draft"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {blog.status ===
                                                                "published"
                                                                    ? "公開"
                                                                    : blog.status ===
                                                                      "draft"
                                                                    ? "下書き"
                                                                    : blog.status}
                                                            </span>
                                                            {blog.published_at && (
                                                                <span>
                                                                    {new Date(
                                                                        blog.published_at
                                                                    ).toLocaleDateString(
                                                                        "ja-JP"
                                                                    )}
                                                                </span>
                                                            )}
                                                            {blog.admin && (
                                                                <span>
                                                                    著者:{" "}
                                                                    {
                                                                        blog
                                                                            .admin
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                router.get(
                                                                    route(
                                                                        "admin.homepage.blogs.show",
                                                                        blog.id
                                                                    )
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="詳細"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                router.get(
                                                                    route(
                                                                        "admin.homepage.blogs.edit",
                                                                        blog.id
                                                                    )
                                                                )
                                                            }
                                                            className="text-green-600 hover:text-green-900"
                                                            title="編集"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">
                                            このカテゴリにはまだブログがありません
                                        </p>
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "admin.homepage.blogs.create"
                                                    )
                                                )
                                            }
                                            className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            ブログを作成
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* サイドバー */}
                    <div className="lg:col-span-1 space-y-6">
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
                                            総投稿数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {category.blogs
                                                ? category.blogs.length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            公開投稿数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {category.blogs
                                                ? category.blogs.filter(
                                                      (blog) =>
                                                          blog.status ===
                                                          "published"
                                                  ).length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">
                                            下書き数
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {category.blogs
                                                ? category.blogs.filter(
                                                      (blog) =>
                                                          blog.status ===
                                                          "draft"
                                                  ).length
                                                : 0}
                                            件
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* メタ情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    メタ情報
                                </h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            作成日
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {new Date(
                                                category.created_at
                                            ).toLocaleString("ja-JP")}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            最終更新
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {new Date(
                                                category.updated_at
                                            ).toLocaleString("ja-JP")}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">
                                            ID
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {category.id}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BlogCategoryShow;
