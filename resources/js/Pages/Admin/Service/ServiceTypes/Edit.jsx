import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PlusIcon,
    XMarkIcon,
    InformationCircleIcon,
    ColorSwatchIcon,
    CalendarIcon,
    CurrencyYenIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

const ServiceTypesEdit = ({ serviceType, serviceCategories }) => {
    const [featuresInput, setFeaturesInput] = useState("");
    const [targetAudienceInput, setTargetAudienceInput] = useState("");
    const [deliverablesInput, setDeliverablesInput] = useState("");
    const [technologiesInput, setTechnologiesInput] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        service_category_id: serviceType.service_category_id || "",
        name: serviceType.name || "",
        slug: serviceType.slug || "",
        description: serviceType.description || "",
        detailed_description: serviceType.detailed_description || "",
        pricing_model: serviceType.pricing_model || "fixed",
        features: serviceType.features || [],
        target_audience: serviceType.target_audience || [],
        deliverables: serviceType.deliverables || [],
        technologies: serviceType.technologies || [],
        icon: serviceType.icon || "",
        color: serviceType.color || "#3B82F6",
        estimated_delivery_days: serviceType.estimated_delivery_days || "",
        base_price: serviceType.base_price || "",
        price_unit: serviceType.price_unit || "",
        sort_order: serviceType.sort_order || "",
        is_active: serviceType.is_active ?? true,
        is_featured: serviceType.is_featured ?? false,
        requires_consultation: serviceType.requires_consultation ?? false,
        consultation_note: serviceType.consultation_note || "",
        published_at: serviceType.published_at
            ? new Date(serviceType.published_at).toISOString().slice(0, 16)
            : "",
    });

    // 名前変更時のスラッグ自動更新（既存のスラッグがある場合は更新しない）
    useEffect(() => {
        if (data.name && data.name !== serviceType.name && !data.slug) {
            const slug = data.name
                .toLowerCase()
                .replace(
                    /[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g,
                    "-"
                )
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            setData("slug", slug);
        }
    }, [data.name]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.service.service-types.update", serviceType.id));
    };

    const addArrayItem = (field, input, setInput) => {
        if (input.trim()) {
            setData(field, [...data[field], input.trim()]);
            setInput("");
        }
    };

    const removeArrayItem = (field, index) => {
        setData(
            field,
            data[field].filter((_, i) => i !== index)
        );
    };

    const pricingModels = {
        fixed: "固定価格",
        subscription: "サブスクリプション",
        custom: "カスタム価格",
        hybrid: "ハイブリッド",
    };

    const priceUnits = [
        "ページ",
        "式",
        "ライセンス",
        "ユーザー",
        "時間",
        "月",
        "年",
    ];

    const commonIcons = [
        "fas fa-globe",
        "fas fa-shopping-cart",
        "fas fa-mobile-alt",
        "fas fa-code",
        "fas fa-cloud",
        "fas fa-database",
        "fas fa-cogs",
        "fas fa-paint-brush",
        "fas fa-chart-bar",
        "fas fa-shield-alt",
        "fas fa-users",
        "fas fa-rocket",
    ];

    const formatPrice = (price, unit) => {
        if (!price) return "要相談";
        return `¥${Number(price).toLocaleString()}${unit ? `/${unit}` : ""}`;
    };

    const PreviewCard = () => (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
                {data.color && (
                    <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: data.color }}
                    ></div>
                )}
                {data.icon && <i className={`${data.icon} mr-3 text-lg`}></i>}
                <h3 className="text-lg font-medium text-gray-900">
                    {data.name || "サービス名"}
                </h3>
            </div>

            {data.description && (
                <p className="text-gray-600 mb-4">{data.description}</p>
            )}

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">価格:</span>
                    <span className="font-medium">
                        {formatPrice(data.base_price, data.price_unit)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">納期:</span>
                    <span className="font-medium">
                        {data.estimated_delivery_days
                            ? `${data.estimated_delivery_days}日`
                            : "要相談"}
                    </span>
                </div>
            </div>

            {data.features && data.features.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">特徴:</p>
                    <div className="flex flex-wrap gap-1">
                        {data.features.slice(0, 3).map((feature, index) => (
                            <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                                {feature}
                            </span>
                        ))}
                        {data.features.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{data.features.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout>
            <Head title={`サービスタイプ編集 - ${serviceType.name}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(
                                    route(
                                        "admin.service.service-types.show",
                                        serviceType.id
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
                                サービスタイプ編集
                            </h1>
                            <p className="text-gray-600">{serviceType.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            {showPreview ? "プレビューを隠す" : "プレビュー"}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        基本情報
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    サービスカテゴリ{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    value={
                                                        data.service_category_id
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "service_category_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">
                                                        選択してください
                                                    </option>
                                                    {serviceCategories.map(
                                                        (category) => (
                                                            <option
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.service_category_id && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.service_category_id
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    料金体系{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    value={data.pricing_model}
                                                    onChange={(e) =>
                                                        setData(
                                                            "pricing_model",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    {Object.entries(
                                                        pricingModels
                                                    ).map(([key, label]) => (
                                                        <option
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.pricing_model && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.pricing_model}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                サービスタイプ名{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="コーポレートサイト制作"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                スラッグ
                                            </label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                    /service-types/
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
                                                    className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="corporate-website"
                                                />
                                            </div>
                                            {errors.slug && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.slug}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                概要説明
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="企業の信頼性と専門性を伝える高品質なコーポレートサイト"
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                詳細説明
                                            </label>
                                            <textarea
                                                value={
                                                    data.detailed_description
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "detailed_description",
                                                        e.target.value
                                                    )
                                                }
                                                rows={6}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="企業のブランドイメージを最大化する..."
                                            />
                                            {errors.detailed_description && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.detailed_description
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 価格・納期設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <CurrencyYenIcon className="w-5 h-5 mr-2" />
                                        価格・納期設定
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                基本価格
                                            </label>
                                            <input
                                                type="number"
                                                value={data.base_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "base_price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="500000"
                                                min="0"
                                                step="1000"
                                            />
                                            {errors.base_price && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.base_price}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                価格単位
                                            </label>
                                            <select
                                                value={data.price_unit}
                                                onChange={(e) =>
                                                    setData(
                                                        "price_unit",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">
                                                    単位を選択
                                                </option>
                                                {priceUnits.map((unit) => (
                                                    <option
                                                        key={unit}
                                                        value={unit}
                                                    >
                                                        {unit}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.price_unit && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.price_unit}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                標準納期（日数）
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    data.estimated_delivery_days
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "estimated_delivery_days",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="30"
                                                min="1"
                                            />
                                            {errors.estimated_delivery_days && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.estimated_delivery_days
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* 要相談設定 */}
                                    <div className="mt-4 space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data.requires_consultation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "requires_consultation",
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                要相談フラグ
                                            </span>
                                        </label>

                                        {data.requires_consultation && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    相談時の注意事項
                                                </label>
                                                <textarea
                                                    value={
                                                        data.consultation_note
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "consultation_note",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="価格は要件によって変動します..."
                                                />
                                                {errors.consultation_note && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.consultation_note
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 配列データ入力セクション */}
                            {/* 特徴・機能 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        特徴・機能
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={featuresInput}
                                                onChange={(e) =>
                                                    setFeaturesInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addArrayItem(
                                                            "features",
                                                            featuresInput,
                                                            setFeaturesInput
                                                        );
                                                    }
                                                }}
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="レスポンシブデザイン"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addArrayItem(
                                                        "features",
                                                        featuresInput,
                                                        setFeaturesInput
                                                    )
                                                }
                                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {data.features.map(
                                                (feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                    >
                                                        {feature}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "features",
                                                                    index
                                                                )
                                                            }
                                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 対象顧客 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        対象顧客
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={targetAudienceInput}
                                                onChange={(e) =>
                                                    setTargetAudienceInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addArrayItem(
                                                            "target_audience",
                                                            targetAudienceInput,
                                                            setTargetAudienceInput
                                                        );
                                                    }
                                                }}
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="中小企業"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addArrayItem(
                                                        "target_audience",
                                                        targetAudienceInput,
                                                        setTargetAudienceInput
                                                    )
                                                }
                                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {data.target_audience.map(
                                                (audience, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                                    >
                                                        {audience}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "target_audience",
                                                                    index
                                                                )
                                                            }
                                                            className="ml-2 text-green-600 hover:text-green-800"
                                                        >
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 成果物 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        成果物
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={deliverablesInput}
                                                onChange={(e) =>
                                                    setDeliverablesInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addArrayItem(
                                                            "deliverables",
                                                            deliverablesInput,
                                                            setDeliverablesInput
                                                        );
                                                    }
                                                }}
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Webサイト"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addArrayItem(
                                                        "deliverables",
                                                        deliverablesInput,
                                                        setDeliverablesInput
                                                    )
                                                }
                                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {data.deliverables.map(
                                                (deliverable, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                                                    >
                                                        {deliverable}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "deliverables",
                                                                    index
                                                                )
                                                            }
                                                            className="ml-2 text-purple-600 hover:text-purple-800"
                                                        >
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 使用技術 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        使用技術
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={technologiesInput}
                                                onChange={(e) =>
                                                    setTechnologiesInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addArrayItem(
                                                            "technologies",
                                                            technologiesInput,
                                                            setTechnologiesInput
                                                        );
                                                    }
                                                }}
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Laravel"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addArrayItem(
                                                        "technologies",
                                                        technologiesInput,
                                                        setTechnologiesInput
                                                    )
                                                }
                                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {data.technologies.map(
                                                (technology, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                                                    >
                                                        {technology}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "technologies",
                                                                    index
                                                                )
                                                            }
                                                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* プレビュー */}
                            {showPreview && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            プレビュー
                                        </h3>
                                        <PreviewCard />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* サイドバー */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* ビジュアル設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <ColorSwatchIcon className="w-5 h-5 mr-2" />
                                        ビジュアル設定
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                アイコン
                                            </label>
                                            <input
                                                type="text"
                                                value={data.icon}
                                                onChange={(e) =>
                                                    setData(
                                                        "icon",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="fas fa-globe"
                                            />
                                            <div className="mt-2 grid grid-cols-3 gap-2">
                                                {commonIcons.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "icon",
                                                                icon
                                                            )
                                                        }
                                                        className="p-2 text-center border border-gray-300 rounded hover:bg-gray-50 text-sm"
                                                    >
                                                        <i className={icon}></i>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                テーマカラー
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={data.color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "color",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "color",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="#3B82F6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 公開設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        公開設定
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                表示順序
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
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                公開日時
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.published_at}
                                                onChange={(e) =>
                                                    setData(
                                                        "published_at",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-3">
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
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    アクティブ
                                                </span>
                                            </label>

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
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    おすすめサービス
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 保存ボタン */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "更新中..."
                                            : "サービスタイプを更新"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ServiceTypesEdit;
