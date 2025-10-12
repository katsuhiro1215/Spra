import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PlusIcon,
    XMarkIcon,
    InformationCircleIcon,
    SwatchIcon,
    CalendarIcon,
    CurrencyYenIcon,
    TagIcon,
} from "@heroicons/react/24/outline";

// 定数とコンポーネント
import { ServiceTypesConstants } from "@/Constants/ServiceTypesConstants";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";
import { ValidationMessages } from "@/Constants/ValidationMessages";
import PageHeader from "@/Components/PageHeader";
import ValidatedInput from "@/Components/ValidatedInput";
import ValidatedTextArea from "@/Components/ValidatedTextArea";
import { useFieldValidation } from "@/Hooks/useFieldValidation";

const ServiceTypesCreate = ({ serviceCategories }) => {
    const [featuresInput, setFeaturesInput] = useState("");
    const [targetAudienceInput, setTargetAudienceInput] = useState("");
    const [deliverablesInput, setDeliverablesInput] = useState("");
    const [technologiesInput, setTechnologiesInput] = useState("");

    // フォームデータ管理
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        service_category_id: "",
        name: "",
        slug: "",
        description: "",
        detailed_description: "",
        pricing_model: "fixed",
        features: [],
        target_audience: [],
        deliverables: [],
        technologies: [],
        icon: "",
        color: "#3B82F6",
        estimated_delivery_days: "",
        base_price: "",
        price_unit: "",
        sort_order: "",
        is_active: true,
        is_featured: false,
        requires_consultation: false,
        consultation_note: "",
        published_at: "",
    });

    // フロントエンドバリデーション
    const {
        errors: validationErrors,
        touched,
        handleFieldBlur,
        validateAll,
    } = useFieldValidation();

    // バリデーションルール
    const validationRules = {
        name: {
            required: true,
            min: 2,
            max: 100,
            label: ServiceTypesConstants.form.fields.name,
        },
        service_category_id: {
            required: true,
            label: ServiceTypesConstants.form.fields.category,
        },
        description: {
            required: true,
            min: 10,
            max: 500,
            label: ServiceTypesConstants.form.fields.description,
        },
        detailed_description: {
            max: 2000,
            label: ServiceTypesConstants.form.fields.detailedDescription,
        },
        base_price: {
            numeric: true,
            label: ServiceTypesConstants.form.fields.basePrice,
            custom: (value) => {
                if (value && parseFloat(value) < 0) {
                    return ValidationMessages.serviceType.priceNegative;
                }
                return null;
            },
        },
    };

    // 名前からスラッグを自動生成
    useEffect(() => {
        if (data.name && !data.slug) {
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

        // 全フィールドのバリデーションを実行
        const allErrors = validateAll(data, validationRules);

        // バリデーションエラーがある場合は送信を停止
        if (Object.keys(allErrors).length > 0) {
            return;
        }

        post(route("admin.service.service-types.store"));
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

    // ページヘッダーのアクション設定
    const headerActions = [
        {
            label: CommonUIConstants.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.service.service-types.index"),
        },
    ];

    return (
        <AdminLayout>
            <Head title={ServiceTypesConstants.form.create.documentTitle} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <PageHeader
                    title={ServiceTypesConstants.form.create.title}
                    description={ServiceTypesConstants.form.create.description}
                    actions={headerActions}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        {
                                            ServiceTypesConstants.form.sections
                                                .basicInfo
                                        }
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {
                                                        ServiceTypesConstants
                                                            .form.fields
                                                            .category
                                                    }{" "}
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
                                                    onBlur={(e) =>
                                                        handleFieldBlur(
                                                            "service_category_id",
                                                            e.target.value,
                                                            validationRules.service_category_id
                                                        )
                                                    }
                                                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                                        validationErrors.service_category_id ||
                                                        errors.service_category_id
                                                            ? "border-red-500 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
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
                                                {(validationErrors.service_category_id ||
                                                    errors.service_category_id) && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {validationErrors.service_category_id ||
                                                            errors.service_category_id}
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
                                            <ValidatedInput
                                                name="name"
                                                label={
                                                    ServiceTypesConstants.form
                                                        .fields.name
                                                }
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={(e) =>
                                                    handleFieldBlur(
                                                        "name",
                                                        e.target.value,
                                                        validationRules.name
                                                    )
                                                }
                                                error={
                                                    validationErrors.name ||
                                                    errors.name
                                                }
                                                required
                                                placeholder={
                                                    ServiceTypesConstants.form
                                                        .placeholders.name
                                                }
                                            />
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
                                            <ValidatedTextArea
                                                name="description"
                                                label="概要説明"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={(e) =>
                                                    handleFieldBlur(
                                                        "description",
                                                        e.target.value,
                                                        validationRules.description
                                                    )
                                                }
                                                error={
                                                    validationErrors.description ||
                                                    errors.description
                                                }
                                                required
                                                rows={3}
                                                placeholder="企業の信頼性と専門性を伝える高品質なコーポレートサイト"
                                            />
                                        </div>

                                        <div>
                                            <ValidatedTextArea
                                                name="detailed_description"
                                                label="詳細説明"
                                                value={
                                                    data.detailed_description
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "detailed_description",
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={(e) =>
                                                    handleFieldBlur(
                                                        "detailed_description",
                                                        e.target.value,
                                                        validationRules.detailed_description
                                                    )
                                                }
                                                error={
                                                    validationErrors.detailed_description ||
                                                    errors.detailed_description
                                                }
                                                rows={6}
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
                                            <ValidatedInput
                                                name="base_price"
                                                label="基本価格"
                                                type="number"
                                                value={data.base_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "base_price",
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={(e) =>
                                                    handleFieldBlur(
                                                        "base_price",
                                                        e.target.value,
                                                        validationRules.base_price
                                                    )
                                                }
                                                error={
                                                    validationErrors.base_price ||
                                                    errors.base_price
                                                }
                                                placeholder="500000"
                                                min="0"
                                                step="1000"
                                            />
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
                        </div>

                        {/* サイドバー */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* ビジュアル設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <SwatchIcon className="w-5 h-5 mr-2" />
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
                                            ? "作成中..."
                                            : "サービスタイプを作成"}
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

export default ServiceTypesCreate;
