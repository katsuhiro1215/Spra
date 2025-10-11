import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeftIcon, TagIcon, EyeIcon } from "@heroicons/react/24/outline";

const BlogCategoryEdit = ({ category }) => {
    const [previewColor, setPreviewColor] = useState(category.color);

    const { data, setData, patch, processing, errors } = useForm({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        color: category.color || "#3B82F6",
        sort_order: category.sort_order || "",
        is_active: category.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.homepage.blogCategories.update", category.id));
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);
    };

    const handleColorChange = (e) => {
        const color = e.target.value;
        setData("color", color);
        setPreviewColor(color);
    };

    const predefinedColors = [
        "#3B82F6",
        "#EF4444",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
        "#F97316",
        "#6366F1",
        "#14B8A6",
        "#F43F5E",
    ];

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
            <Head title={`ブログカテゴリ編集 - ${category.name}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() =>
                            router.get(
                                route(
                                    "admin.homepage.blogCategories.show",
                                    category.id
                                )
                            )
                        }
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        詳細に戻る
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ブログカテゴリ編集
                        </h1>
                        <p className="text-gray-600">{category.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* メインフォーム */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* カテゴリ名 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            カテゴリ名{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={handleNameChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="テクノロジー、ライフスタイルなど..."
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* スラッグ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            スラッグ
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                /category/
                                            </span>
                                            <input
                                                type="text"
                                                value={data.slug}
                                                onChange={(e) =>
                                                    setData(
                                                        "slug",
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="technology, lifestyle..."
                                            />
                                        </div>
                                        {errors.slug && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.slug}
                                            </div>
                                        )}
                                    </div>

                                    {/* 説明 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            説明
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="このカテゴリの説明を入力..."
                                        />
                                        {errors.description && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.description}
                                            </div>
                                        )}
                                    </div>

                                    {/* カラー選択 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            カテゴリカラー{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        {/* 定義済みカラー */}
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                定義済みカラー
                                            </p>
                                            <div className="grid grid-cols-6 gap-2">
                                                {predefinedColors.map(
                                                    (color) => (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            onClick={() =>
                                                                handleColorChange(
                                                                    {
                                                                        target: {
                                                                            value: color,
                                                                        },
                                                                    }
                                                                )
                                                            }
                                                            className={`w-10 h-10 rounded-lg border-2 ${
                                                                data.color ===
                                                                color
                                                                    ? "border-gray-400"
                                                                    : "border-gray-200"
                                                            } hover:border-gray-400 transition-colors`}
                                                            style={{
                                                                backgroundColor:
                                                                    color,
                                                            }}
                                                            title={color}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* カスタムカラー */}
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <input
                                                    type="color"
                                                    value={data.color}
                                                    onChange={handleColorChange}
                                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={data.color}
                                                    onChange={(e) => {
                                                        setData(
                                                            "color",
                                                            e.target.value
                                                        );
                                                        setPreviewColor(
                                                            e.target.value
                                                        );
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="#3B82F6"
                                                />
                                            </div>
                                        </div>
                                        {errors.color && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.color}
                                            </div>
                                        )}
                                    </div>

                                    {/* 並び順 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            並び順
                                        </label>
                                        <input
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) =>
                                                setData(
                                                    "sort_order",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="1"
                                            min="0"
                                        />
                                        {errors.sort_order && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.sort_order}
                                            </div>
                                        )}
                                    </div>

                                    {/* ステータス */}
                                    <div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_active",
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor="is_active"
                                                className="ml-2 block text-sm text-gray-700"
                                            >
                                                有効化する
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            無効にすると、フロントエンドでは表示されません
                                        </p>
                                        {errors.is_active && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.is_active}
                                            </div>
                                        )}
                                    </div>

                                    {/* アクションボタン */}
                                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "admin.homepage.blogCategories.show",
                                                        category.id
                                                    )
                                                )
                                            }
                                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            キャンセル
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "更新中..."
                                                : "変更を保存"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* プレビューサイドバー */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg sticky top-6">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <EyeIcon className="w-5 h-5 mr-2" />
                                    プレビュー
                                </h3>

                                <div className="space-y-4">
                                    {/* カテゴリタグプレビュー */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            カテゴリタグ
                                        </p>
                                        <div
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: previewColor,
                                                color: getContrastColor(
                                                    previewColor
                                                ),
                                            }}
                                        >
                                            <TagIcon className="w-4 h-4 mr-1" />
                                            {data.name || "カテゴリ名"}
                                        </div>
                                    </div>

                                    {/* カテゴリバッジプレビュー */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            カテゴリバッジ
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{
                                                    backgroundColor:
                                                        previewColor,
                                                }}
                                            ></div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {data.name || "カテゴリ名"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* URL プレビュー */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            URL
                                        </p>
                                        <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700 break-all">
                                            /category/{data.slug || "slug"}
                                        </div>
                                    </div>

                                    {/* 説明プレビュー */}
                                    {data.description && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                説明
                                            </p>
                                            <div className="text-sm text-gray-700">
                                                {data.description}
                                            </div>
                                        </div>
                                    )}

                                    {/* 統計情報 */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-600 mb-2">
                                            統計情報
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    投稿数:
                                                </span>
                                                <span className="font-medium">
                                                    {category.blogs_count || 0}
                                                    件
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    作成日:
                                                </span>
                                                <span className="font-medium">
                                                    {new Date(
                                                        category.created_at
                                                    ).toLocaleDateString(
                                                        "ja-JP"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
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

export default BlogCategoryEdit;
