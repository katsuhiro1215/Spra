import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Create({ serviceCategories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        service_category_id: "",
        description: "",
        details: "",
        icon: "",
        features: [""],
        pricing: [{ name: "", price: 0, description: "" }],
        demo_links: [{ name: "", url: "" }],
        gallery: [""],
        technologies: [""],
        status: "active",
        sort_order: 0,
        is_featured: false,
        is_active: true,
    });

    const [autoSlug, setAutoSlug] = useState(true);

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

    // 配列フィールドのヘルパー関数
    const addArrayItem = (field, defaultValue = "") => {
        const currentArray = Array.isArray(data[field]) ? data[field] : [];
        setData(field, [...currentArray, defaultValue]);
    };

    const removeArrayItem = (field, index) => {
        const currentArray = Array.isArray(data[field]) ? data[field] : [];
        const newArray = currentArray.filter((_, i) => i !== index);
        setData(field, newArray);
    };

    const updateArrayItem = (field, index, value) => {
        const currentArray = Array.isArray(data[field]) ? data[field] : [];
        const newArray = [...currentArray];
        newArray[index] = value;
        setData(field, newArray);
    };

    // 価格設定のヘルパー関数
    const addPricingItem = () => {
        addArrayItem("pricing", { name: "", price: 0, description: "" });
    };

    const removePricingItem = (index) => {
        removeArrayItem("pricing", index);
    };

    const updatePricingItem = (index, field, value) => {
        const currentPricing = Array.isArray(data.pricing) ? data.pricing : [];
        const newPricing = [...currentPricing];
        newPricing[index] = { ...newPricing[index], [field]: value };
        setData("pricing", newPricing);
    };

    // デモリンクのヘルパー関数
    const addDemoLink = () => {
        addArrayItem("demo_links", { name: "", url: "" });
    };

    const removeDemoLink = (index) => {
        removeArrayItem("demo_links", index);
    };

    const updateDemoLink = (index, field, value) => {
        const currentLinks = Array.isArray(data.demo_links)
            ? data.demo_links
            : [];
        const newLinks = [...currentLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setData("demo_links", newLinks);
    };

    const submit = (e) => {
        e.preventDefault();

        // 空の要素を除外
        const cleanedData = {
            ...data,
            features: data.features.filter((f) => f.trim() !== ""),
            gallery: data.gallery.filter((g) => g.trim() !== ""),
            technologies: data.technologies.filter((t) => t.trim() !== ""),
            pricing: data.pricing.filter(
                (p) => p.name.trim() !== "" || p.price > 0
            ),
            demo_links: data.demo_links.filter(
                (d) => d.name.trim() !== "" || d.url.trim() !== ""
            ),
        };

        post(route("admin.homepage.services.store"), {
            data: cleanedData,
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("admin.homepage.services.index")}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        戻る
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        サービス作成
                    </h2>
                </div>
            }
        >
            <Head title="サービス作成" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-8">
                            {/* 基本情報 */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    基本情報
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            サービス名{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={handleNameChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="例: コーポレートサイト制作"
                                        />
                                        {errors.name && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

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
                                        <input
                                            type="text"
                                            id="slug"
                                            value={data.slug}
                                            onChange={handleSlugChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="例: corporate-website"
                                        />
                                        {errors.slug && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.slug}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="service_category_id"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            サービスカテゴリ{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="service_category_id"
                                            value={data.service_category_id}
                                            onChange={(e) =>
                                                setData(
                                                    "service_category_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                カテゴリを選択
                                            </option>
                                            {serviceCategories.map(
                                                (category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {errors.service_category_id && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.service_category_id}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="icon"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            アイコン
                                        </label>
                                        <input
                                            type="text"
                                            id="icon"
                                            value={data.icon}
                                            onChange={(e) =>
                                                setData("icon", e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="例: building-office"
                                        />
                                        {errors.icon && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.icon}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        説明{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="サービスの簡潔な説明を入力してください"
                                    />
                                    {errors.description && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <label
                                        htmlFor="details"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        詳細説明{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="details"
                                        rows={6}
                                        value={data.details}
                                        onChange={(e) =>
                                            setData("details", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="サービスの詳細な説明を入力してください"
                                    />
                                    {errors.details && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.details}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 特徴・機能 */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        特徴・機能
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem("features", "")
                                        }
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        追加
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3"
                                        >
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "features",
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="機能や特徴を入力"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "features",
                                                        index
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 価格設定 */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        価格設定
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addPricingItem}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        追加
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {data.pricing.map((pricing, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-gray-900">
                                                    プラン {index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePricingItem(index)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        プラン名
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={pricing.name}
                                                        onChange={(e) =>
                                                            updatePricingItem(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        placeholder="例: ベーシック"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        価格（円）
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={pricing.price}
                                                        onChange={(e) =>
                                                            updatePricingItem(
                                                                index,
                                                                "price",
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        placeholder="300000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        説明
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            pricing.description
                                                        }
                                                        onChange={(e) =>
                                                            updatePricingItem(
                                                                index,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        placeholder="プランの説明"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* デモリンク */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        デモリンク
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addDemoLink}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        追加
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.demo_links.map((link, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                        >
                                            <input
                                                type="text"
                                                value={link.name}
                                                onChange={(e) =>
                                                    updateDemoLink(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="リンク名"
                                            />
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) =>
                                                        updateDemoLink(
                                                            index,
                                                            "url",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="https://example.com"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeDemoLink(index)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 使用技術 */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        使用技術
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem("technologies", "")
                                        }
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        追加
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.technologies.map((tech, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3"
                                        >
                                            <input
                                                type="text"
                                                value={tech}
                                                onChange={(e) =>
                                                    updateArrayItem(
                                                        "technologies",
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="例: Laravel, React"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "technologies",
                                                        index
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 設定 */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    設定
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            ステータス{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="active">
                                                アクティブ
                                            </option>
                                            <option value="inactive">
                                                非アクティブ
                                            </option>
                                            <option value="draft">
                                                下書き
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>

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
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.sort_order && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.sort_order}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.is_featured}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_featured",
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                おすすめサービス
                                            </span>
                                        </label>

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
                                    </div>
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    href={route(
                                        "admin.homepage.services.index"
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    キャンセル
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? "作成中..." : "作成"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
