import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const colorOptions = [
    { value: "#3B82F6", label: "ブルー", color: "#3B82F6" },
    { value: "#10B981", label: "グリーン", color: "#10B981" },
    { value: "#F59E0B", label: "イエロー", color: "#F59E0B" },
    { value: "#EF4444", label: "レッド", color: "#EF4444" },
    { value: "#8B5CF6", label: "パープル", color: "#8B5CF6" },
    { value: "#06B6D4", label: "シアン", color: "#06B6D4" },
    { value: "#F97316", label: "オレンジ", color: "#F97316" },
    { value: "#6B7280", label: "グレー", color: "#6B7280" },
];

const iconOptions = [
    { value: "globe-alt", label: "グローブ" },
    { value: "code-bracket", label: "コード" },
    { value: "device-phone-mobile", label: "モバイル" },
    { value: "paint-brush", label: "ペイントブラシ" },
    { value: "megaphone", label: "メガホン" },
    { value: "lightbulb", label: "ライトバルブ" },
    { value: "wrench-screwdriver", label: "レンチ" },
    { value: "ellipsis-horizontal", label: "その他" },
];

export default function Edit({ serviceCategory }) {
    const { data, setData, put, processing, errors } = useForm({
        name: serviceCategory.name || "",
        slug: serviceCategory.slug || "",
        description: serviceCategory.description || "",
        color: serviceCategory.color || "#3B82F6",
        icon: serviceCategory.icon || "",
        sort_order: serviceCategory.sort_order || 0,
        is_active: serviceCategory.is_active ?? true,
    });

    const [autoSlug, setAutoSlug] = useState(false);

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);

        if (autoSlug) {
            setData("slug", generateSlug(name));
        }
    };

    const handleSlugChange = (e) => {
        setData("slug", e.target.value);
        setAutoSlug(false);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.homepage.serviceCategories.update", serviceCategory));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("admin.homepage.serviceCategories.index")}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        戻る
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        サービスカテゴリ編集
                    </h2>
                </div>
            }
        >
            <Head title={`サービスカテゴリ編集 - ${serviceCategory.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* カテゴリ名 */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        カテゴリ名{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="例: Webサイト制作"
                                    />
                                    {errors.name && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* スラッグ */}
                                <div>
                                    <label
                                        htmlFor="slug"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        スラッグ
                                        <span className="text-xs text-gray-500 ml-2">
                                            (空白の場合は自動生成)
                                        </span>
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            id="slug"
                                            value={data.slug}
                                            onChange={handleSlugChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="例: web-development"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAutoSlug(true);
                                                setData(
                                                    "slug",
                                                    generateSlug(data.name)
                                                );
                                            }}
                                            className="mt-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                                        >
                                            自動生成
                                        </button>
                                    </div>
                                    {errors.slug && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.slug}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 説明 */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    説明
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="カテゴリの説明を入力してください"
                                />
                                {errors.description && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* カラー */}
                                <div>
                                    <label
                                        htmlFor="color"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        カラー{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-4 gap-2">
                                            {colorOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "color",
                                                            option.value
                                                        )
                                                    }
                                                    className={`w-full h-10 rounded-md border-2 ${
                                                        data.color ===
                                                        option.value
                                                            ? "border-gray-900"
                                                            : "border-gray-300"
                                                    } hover:border-gray-600 transition-colors`}
                                                    style={{
                                                        backgroundColor:
                                                            option.color,
                                                    }}
                                                    title={option.label}
                                                />
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            placeholder="#3B82F6"
                                        />
                                    </div>
                                    {errors.color && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.color}
                                        </div>
                                    )}
                                </div>

                                {/* アイコン */}
                                <div>
                                    <label
                                        htmlFor="icon"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        アイコン
                                    </label>
                                    <select
                                        id="icon"
                                        value={data.icon}
                                        onChange={(e) =>
                                            setData("icon", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">アイコンを選択</option>
                                        {iconOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.icon && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.icon}
                                        </div>
                                    )}
                                </div>

                                {/* 表示順 */}
                                <div>
                                    <label
                                        htmlFor="sort_order"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        表示順
                                    </label>
                                    <input
                                        type="number"
                                        id="sort_order"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.sort_order && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.sort_order}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ステータス */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        アクティブ
                                    </span>
                                </label>
                                {errors.is_active && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.is_active}
                                    </div>
                                )}
                            </div>

                            {/* プレビュー */}
                            {data.name && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        プレビュー
                                    </h4>
                                    <div
                                        className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium"
                                        style={{ backgroundColor: data.color }}
                                    >
                                        {data.icon && (
                                            <i
                                                className={`heroicon-${data.icon} h-4 w-4 mr-2`}
                                            ></i>
                                        )}
                                        {data.name}
                                    </div>
                                </div>
                            )}

                            {/* アクションボタン */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <Link
                                    href={route(
                                        "admin.homepage.serviceCategories.show",
                                        serviceCategory
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    詳細に戻る
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route(
                                            "admin.homepage.serviceCategories.index"
                                        )}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        キャンセル
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? "更新中..." : "更新"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
