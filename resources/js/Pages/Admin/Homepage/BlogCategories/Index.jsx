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
    AdjustmentsHorizontalIcon,
    TagIcon,
} from "@heroicons/react/24/outline";

const BlogCategoriesIndex = ({ categories, filters, flash }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [sortableCategories, setSortableCategories] = useState(
        categories.data || []
    );

    const { data, setData, get } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        sort: filters.sort || "sort_order",
        direction: filters.direction || "asc",
    });

    // 検索・フィルタリング
    const handleFilter = (key, value) => {
        setData(key, value);
        get(route("admin.homepage.blogCategories.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 一括選択
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedCategories(
                categories.data.map((category) => category.id)
            );
        } else {
            setSelectedCategories([]);
        }
    };

    const handleSelectCategory = (id, checked) => {
        if (checked) {
            setSelectedCategories((prev) => [...prev, id]);
        } else {
            setSelectedCategories((prev) =>
                prev.filter((categoryId) => categoryId !== id)
            );
        }
    };

    // 一括操作
    const handleBulkAction = (action) => {
        if (selectedCategories.length === 0) return;

        let confirmMessage = "";
        switch (action) {
            case "activate":
                confirmMessage = `選択した${selectedCategories.length}件のカテゴリを有効化しますか？`;
                break;
            case "deactivate":
                confirmMessage = `選択した${selectedCategories.length}件のカテゴリを無効化しますか？`;
                break;
            case "delete":
                confirmMessage = `選択した${selectedCategories.length}件のカテゴリを削除しますか？この操作は取り消せません。`;
                break;
        }

        if (confirm(confirmMessage)) {
            router.post(
                route("admin.homepage.blogCategories.bulk-action"),
                {
                    action,
                    ids: selectedCategories,
                },
                {
                    onSuccess: () => setSelectedCategories([]),
                }
            );
        }
    };

    // 削除
    const handleDelete = (category) => {
        if (
            confirm(
                `「${category.name}」を削除しますか？この操作は取り消せません。`
            )
        ) {
            router.delete(
                route("admin.homepage.blogCategories.destroy", category.id)
            );
        }
    };

    // ソート
    const handleSort = (field) => {
        const direction =
            data.sort === field && data.direction === "asc" ? "desc" : "asc";
        handleFilter("sort", field);
        handleFilter("direction", direction);
    };

    // ソート順更新
    const handleUpdateOrder = () => {
        const categoryData = sortableCategories.map((category, index) => ({
            id: category.id,
            sort_order: index + 1,
        }));

        router.post(route("admin.homepage.blogCategories.update-order"), {
            categories: categoryData,
        });
    };

    return (
        <AdminLayout>
            <Head title="ブログカテゴリ管理" />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ブログカテゴリ管理
                        </h1>
                        <p className="text-gray-600">
                            ブログのカテゴリを管理します
                        </p>
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
                                router.get(
                                    route(
                                        "admin.homepage.blogCategories.create"
                                    )
                                )
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        placeholder="カテゴリ名で検索..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

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
                                    <option value="active">有効</option>
                                    <option value="inactive">無効</option>
                                </select>
                            </div>

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
                                    <option value="sort_order-asc">
                                        並び順 (昇順)
                                    </option>
                                    <option value="sort_order-desc">
                                        並び順 (降順)
                                    </option>
                                    <option value="name-asc">名前 (A-Z)</option>
                                    <option value="name-desc">
                                        名前 (Z-A)
                                    </option>
                                    <option value="posts_count-desc">
                                        投稿数 (多い順)
                                    </option>
                                    <option value="posts_count-asc">
                                        投稿数 (少ない順)
                                    </option>
                                    <option value="created_at-desc">
                                        作成日 (新しい順)
                                    </option>
                                    <option value="created_at-asc">
                                        作成日 (古い順)
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 一括操作バー */}
                {selectedCategories.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-blue-800 font-medium">
                                {selectedCategories.length}件選択中
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleBulkAction("activate")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                                >
                                    有効化
                                </button>
                                <button
                                    onClick={() =>
                                        handleBulkAction("deactivate")
                                    }
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                >
                                    無効化
                                </button>
                                <button
                                    onClick={() => handleBulkAction("delete")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    削除
                                </button>
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    選択解除
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* カテゴリ一覧テーブル */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedCategories.length ===
                                                    categories.data.length &&
                                                categories.data.length > 0
                                            }
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("sort_order")}
                                    >
                                        並び順
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("name")}
                                    >
                                        カテゴリ名
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        説明
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            handleSort("posts_count")
                                        }
                                    >
                                        投稿数
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("created_at")}
                                    >
                                        作成日
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(
                                                    category.id
                                                )}
                                                onChange={(e) =>
                                                    handleSelectCategory(
                                                        category.id,
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {category.sort_order}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-4 h-4 rounded-full mr-3 border"
                                                    style={{
                                                        backgroundColor:
                                                            category.color,
                                                    }}
                                                ></div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        /{category.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="max-w-xs truncate">
                                                {category.description || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {category.blogs_count || 0}件
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
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
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                category.created_at
                                            ).toLocaleDateString("ja-JP")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                "admin.homepage.blogCategories.show",
                                                                category.id
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
                                                                "admin.homepage.blogCategories.edit",
                                                                category.id
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
                                                        handleDelete(category)
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
                    {categories.links && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {categories.from} - {categories.to} 件目 (全{" "}
                                    {categories.total} 件中)
                                </div>
                                <div className="flex space-x-1">
                                    {categories.links.map((link, index) => (
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
                {categories.data.length === 0 && (
                    <div className="text-center py-12">
                        <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            カテゴリがありません
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            最初のブログカテゴリを作成しましょう。
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() =>
                                    router.get(
                                        route(
                                            "admin.homepage.blogCategories.create"
                                        )
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

export default BlogCategoriesIndex;
