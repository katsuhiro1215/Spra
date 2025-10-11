import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentTextIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";

const BlogsIndex = ({ blogs, categories, authors, filters, flash }) => {
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        category_id: filters.category_id || "",
        author_id: filters.author_id || "",
        sort: filters.sort || "created_at",
        direction: filters.direction || "desc",
    });

    // 検索・フィルタリング
    const handleFilter = (key, value) => {
        setData(key, value);
        get(route("admin.homepage.blogs.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 一括選択
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedBlogs(blogs.data.map((blog) => blog.id));
        } else {
            setSelectedBlogs([]);
        }
    };

    const handleSelectBlog = (id, checked) => {
        if (checked) {
            setSelectedBlogs((prev) => [...prev, id]);
        } else {
            setSelectedBlogs((prev) => prev.filter((blogId) => blogId !== id));
        }
    };

    // 一括操作
    const handleBulkAction = (action) => {
        if (selectedBlogs.length === 0) return;

        let confirmMessage = "";
        switch (action) {
            case "publish":
                confirmMessage = `選択した${selectedBlogs.length}件のブログを公開しますか？`;
                break;
            case "draft":
                confirmMessage = `選択した${selectedBlogs.length}件のブログを下書きに変更しますか？`;
                break;
            case "delete":
                confirmMessage = `選択した${selectedBlogs.length}件のブログを削除しますか？この操作は取り消せません。`;
                break;
        }

        if (confirm(confirmMessage)) {
            router.post(
                route("admin.homepage.blogs.bulk-action"),
                {
                    action,
                    ids: selectedBlogs,
                },
                {
                    onSuccess: () => setSelectedBlogs([]),
                }
            );
        }
    };

    // 削除
    const handleDelete = (blog) => {
        if (
            confirm(
                `「${blog.title}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            router.delete(route("admin.homepage.blogs.destroy", blog.id));
        }
    };

    // ステータス変更
    const handleStatusChange = (blog, status) => {
        const published_at =
            status === "published" ? new Date().toISOString() : null;

        router.patch(route("admin.homepage.blogs.change-status", blog.id), {
            status,
            published_at,
        });
    };

    // ソート
    const handleSort = (field) => {
        const direction =
            data.sort === field && data.direction === "asc" ? "desc" : "asc";
        handleFilter("sort", field);
        handleFilter("direction", direction);
    };

    // ステータスバッジ
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

    return (
        <AdminLayout>
            <Head title="ブログ管理" />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ブログ管理
                        </h1>
                        <p className="text-gray-600">ブログ記事を管理します</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FunnelIcon className="w-4 h-4 mr-2" />
                            フィルター
                        </button>
                        <button
                            onClick={() =>
                                router.get(route("admin.homepage.blogs.create"))
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            新規作成
                        </button>
                    </div>
                </div>

                {/* フィルターパネル */}
                {showFilters && (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* 検索 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    検索
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.search}
                                        onChange={(e) =>
                                            handleFilter(
                                                "search",
                                                e.target.value
                                            )
                                        }
                                        placeholder="タイトル、内容で検索..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* ステータス */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ステータス
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        handleFilter("status", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">すべて</option>
                                    <option value="published">公開</option>
                                    <option value="draft">下書き</option>
                                    <option value="scheduled">予約投稿</option>
                                </select>
                            </div>

                            {/* カテゴリ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    カテゴリ
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        handleFilter(
                                            "category_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">すべて</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 作成者 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    作成者
                                </label>
                                <select
                                    value={data.author_id}
                                    onChange={(e) =>
                                        handleFilter(
                                            "author_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">すべて</option>
                                    {authors.map((author) => (
                                        <option
                                            key={author.id}
                                            value={author.id}
                                        >
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ソート */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ソート
                                </label>
                                <select
                                    value={`${data.sort}-${data.direction}`}
                                    onChange={(e) => {
                                        const [sort, direction] =
                                            e.target.value.split("-");
                                        handleFilter("sort", sort);
                                        handleFilter("direction", direction);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="created_at-desc">
                                        作成日 (新しい順)
                                    </option>
                                    <option value="created_at-asc">
                                        作成日 (古い順)
                                    </option>
                                    <option value="updated_at-desc">
                                        更新日 (新しい順)
                                    </option>
                                    <option value="updated_at-asc">
                                        更新日 (古い順)
                                    </option>
                                    <option value="published_at-desc">
                                        公開日 (新しい順)
                                    </option>
                                    <option value="published_at-asc">
                                        公開日 (古い順)
                                    </option>
                                    <option value="title-asc">
                                        タイトル (A-Z)
                                    </option>
                                    <option value="title-desc">
                                        タイトル (Z-A)
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 一括操作バー */}
                {selectedBlogs.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-blue-800 font-medium">
                                {selectedBlogs.length}件選択中
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleBulkAction("publish")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                                >
                                    公開
                                </button>
                                <button
                                    onClick={() => handleBulkAction("draft")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                >
                                    下書きに変更
                                </button>
                                <button
                                    onClick={() => handleBulkAction("delete")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    削除
                                </button>
                                <button
                                    onClick={() => setSelectedBlogs([])}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    選択解除
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ブログ一覧テーブル */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedBlogs.length ===
                                                    blogs.data.length &&
                                                blogs.data.length > 0
                                            }
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        画像
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("title")}
                                    >
                                        タイトル
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        カテゴリ
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("status")}
                                    >
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        作成者
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            handleSort("published_at")
                                        }
                                    >
                                        公開日
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.data.map((blog) => (
                                    <tr
                                        key={blog.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedBlogs.includes(
                                                    blog.id
                                                )}
                                                onChange={(e) =>
                                                    handleSelectBlog(
                                                        blog.id,
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                                                {blog.featured_media ? (
                                                    <img
                                                        src={
                                                            blog.featured_media
                                                                .url
                                                        }
                                                        alt={
                                                            blog.featured_media
                                                                .alt_text ||
                                                            blog.title
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PhotoIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {blog.title}
                                                </div>
                                                {blog.excerpt && (
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {blog.excerpt}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-400">
                                                    /{blog.slug}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {blog.categories.map(
                                                    (category) => (
                                                        <span
                                                            key={category.id}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color +
                                                                    "20",
                                                                color: category.color,
                                                            }}
                                                        >
                                                            {category.name}
                                                        </span>
                                                    )
                                                )}
                                                {blog.categories.length ===
                                                    0 && (
                                                    <span className="text-sm text-gray-400">
                                                        未分類
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(blog.status)}
                                                <select
                                                    value={blog.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            blog,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="draft">
                                                        下書き
                                                    </option>
                                                    <option value="published">
                                                        公開
                                                    </option>
                                                    <option value="scheduled">
                                                        予約投稿
                                                    </option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <UserIcon className="w-4 h-4 mr-1" />
                                                {blog.admin?.name || "不明"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {blog.published_at ? (
                                                <div className="flex items-center">
                                                    <CalendarIcon className="w-4 h-4 mr-1" />
                                                    {new Date(
                                                        blog.published_at
                                                    ).toLocaleDateString(
                                                        "ja-JP"
                                                    )}
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                                <button
                                                    onClick={() =>
                                                        handleDelete(blog)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                    title="削除"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ページネーション */}
                    {blogs.links && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {blogs.from} - {blogs.to} 件目 (全{" "}
                                    {blogs.total} 件中)
                                </div>
                                <div className="flex space-x-1">
                                    {blogs.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            disabled={!link.url}
                                            className={`px-3 py-2 text-sm font-medium border rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : link.url
                                                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 空の場合 */}
                {blogs.data.length === 0 && (
                    <div className="text-center py-12">
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            ブログがありません
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            最初のブログ記事を作成しましょう。
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() =>
                                    router.get(
                                        route("admin.homepage.blogs.create")
                                    )
                                }
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                新規作成
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default BlogsIndex;
